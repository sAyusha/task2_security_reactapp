const User = require("../models/user");
const Bid = require("../models/bid");
const Art = require("../models/art");
const crypto = require("crypto");
const algorithm = "aes-256-cbc";

const encrypt = (data) => {
  // Generate a random 256-bit key each time
  const secretKey = crypto.randomBytes(32);
  // console.log('Generated Key:', secretKey.toString('hex'));

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

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
    Buffer.from(secretKey, 'hex'),
    Buffer.from(data.iv, 'hex')
  );
  let decrypted = decipher.update(data.encryptedData, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return JSON.parse(decrypted);
};

const getBid = async (req, res, next) => {
  try {
    const bidId = req.params.bid_id;

    // Retrieve the bid from the database using the bidId
    const bid = await Bid.findById(bidId)
      .populate({
        path: 'bidArt',
        populate: {
          path: 'highestBidder', // Populate the highestBidder field from the artSchema
          model: 'User',
        },
      })
      .populate('user'); // Populate the user field from the bidSchema

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Encrypt sensitive bid data
    const encryptedBid = encrypt(bid);

    // Return the bid information along with the highest bid amount for the art
    return res.status(200).json({
      data: [encryptedBid],
      highestBidAmount: bid.bidArt.highestBidAmount,
      highestBidder: bid.bidArt.highestBidder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const getAllBids = async (req, res, next) => {
  try {
    // Retrieve all bids from the database
    const allBids = await Bid.find();

    // Return the array of all bids
    return res.status(200).json({ data: allBids });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function for placing a bid
const placeBid = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bidPrice = req.body.bidAmount; // Retrieve the bid price from the request body

    const artId = req.params.art_id;
    const art = await Art.findById(artId);

    if (!art) {
      return res.status(404).json({ message: "Art not found" });
    }

    // Retrieve the current highest bid amount and its bidder
    const highestBidAmount = art.highestBidAmount || 0;
    const highestBidder = art.highestBidder;

    // Check if the current bid is the first bid for the art
    const isFirstBid = !highestBidder;

    if (bidPrice <= art.startingBid) {
      return res
        .status(400)
        .json({ message: "Bid amount must be greater than the current bid." });
    }

    if (art.artExpired) {
      return res
        .status(403)
        .json({ error: "Art has expired and cannot be updated" });
    }

    // Check if the current time is greater than the expiration date
    if (new Date() > art.endingDate) {
      art.artExpired = true;
      await art.save();
      return res
        .status(403)
        .json({ error: "Art has expired and cannot be updated" });
    }

    // Update the bidStatus in the user schema based on the bid amount
    if (bidPrice > highestBidAmount) {
      art.highestBidAmount = bidPrice; // Update the highest bid amount in the art schema

      // If it's not the first bid, set the current bidder's bidStatus to 'winner'
      if (!isFirstBid) {
        user.bidStatus = "Winner";
      }

      // If it's the first bid, set the bidder's bidStatus to 'Pending'
      if (isFirstBid) {
        user.bidStatus = "Pending";
      }

      // Set the bidStatus of the previous highest bidder to 'loser'
      if (highestBidder) {
        const previousHighestBidder = await User.findById(highestBidder);
        if (previousHighestBidder) {
          previousHighestBidder.bidStatus = "Loser";
          await previousHighestBidder.save();
        }
      }

      art.highestBidder = userId; // Update the highest bidder in the art schema
    } else {
      // If it's not the first bid, set the current bidder's bidStatus to 'Loser'
      if (!isFirstBid) {
        user.bidStatus = "Loser";
      }
    }

    // Create a new bid instance and save it to the database
    const newBid = new Bid({
      bidAmount: bidPrice,
      bidArt: artId,
      user: userId,
    });

    await newBid.save();

    await art.save();
    await user.save(); // Save the updated user object

    return res.status(200).json({
      data: newBid,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllBids,
  placeBid,
  getBid,
};
