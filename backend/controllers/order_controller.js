const Order = require('../models/order');
const User = require('../models/user')
const Art = require('../models/art')
const crypto = require('crypto'); 
const algorithm = 'aes-256-cbc';

const encrypt = (data) => {
   // Generate a random 256-bit key each time
   const secretKey = crypto.randomBytes(32);
   // console.log('Generated Key:', secretKey.toString('hex'));
 
   const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
  };
};

const decrypt = (data) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    Buffer.from(data.iv, 'hex')
  );
  let decrypted = decipher.update(data.encryptedData, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return JSON.parse(decrypted);
};

const getAllOrder = async (req, res) => {
    try{
        const orders = await Order.find();
        res.json({data: orders})

    }
    catch(error){
        next(error)
    }

};

const createOrder = async (req, res, next) => {
    try{
        const newOrder = new Order({
        orderItems: req.body.orderItems.map((item) => ({
            ...item,
            art: item.artId,
        })),

        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        bidAmount: req.body.bidAmount,
        shippingPrice: req.body.shippingPrice,
        totalAmount: req.body.totalAmount,
        user: req.user.id,
    });

    const order = await newOrder.save();
    res.status(201).send({
        message: 'New Order Created',
        data: order,
    });
    } catch(error){
        next(error);
    }
};

const getMine = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id });

    const orderData = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findById(order.user).select('bidStatus');
        const orderItems = order.orderItems.map(async (item) => {
          const art = await Art.findById(item.art).select('image title description');
          return {
            image: item.image,
            title: item.title,
            description: item.description,
            art: art,
          };
        });

        // Encrypt the shippingAddress before storing it in orderData
        const encryptedShippingAddress = encrypt(order.shippingAddress);

        const items = await Promise.all(orderItems);

        return {
          _id: order._id,
          bidAmount: order.bidAmount,
          shippingAddress: encryptedShippingAddress,
          paymentMethod: order.paymentMethod,
          shippingPrice: order.shippingPrice,
          totalAmount: order.totalAmount,
          isPaid: order.isPaid,
          isDelivered: order.isDelivered,
          user: order.user,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          id: order.id,
          orderItems: items,
          bidStatus: user ? user.bidStatus : null,
        };
      })
    );

    res.json({ data: orderData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

  
const getOrderById = async(req, res, next) => {
    const orderId = req.params.order_id;
    const order = await Order.findById(orderId);
    if(order){
        res.json({data: [order]});
    }
    else{
        res.status(404).json({message: 'Order not found'});
    }
};

const deleteOrder = async(req, res, next) => {
    const order = await Order.findById(req.params.order_id);
    if(order){
        await Order.findByIdAndDelete(req.params._id);
        res.json({message: 'Order removed'});
    }
    else{
        res.status(404).json({message: 'Order not found'});
    }
};

const updateOrderToPaid = async (req, res, next) => {
    const orderId = req.params.order_id;
  
    try {
      const order = await Order.findById(orderId).populate('user');
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      if (order.isPaid) {
        return res.status(400).json({ message: 'Order is already paid' });
      }
  
      // Update the order as paid
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
  
      await order.save();
  
      // Add the ordered art to the collectedArt field in the user schema
      const userId = order.user._id;
      const artIds = order.orderItems.map((item) => item.art);
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Filter out any duplicate art IDs and add them to the collectedArt array
      const uniqueArtIds = [...new Set(artIds)];
      user.collectedArt.push(...uniqueArtIds);
      await user.save();
  
      res.json({ message: 'Order paid successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  

const updateOrderToDelivered = async(req, res, next) => {
    const order = await Order.findById(req.params.order_id);
    if(order){
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        await order.save();
        res.json({message: 'Order delivered'});
    }
    else{
        res.status(404).json({message: 'Order not found'});
    }
};

module.exports = {
    getAllOrder,
    createOrder,
    getMine,
    getOrderById,
    deleteOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
}