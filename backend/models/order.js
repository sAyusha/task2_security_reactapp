const mongoose = require('mongoose');
const User = require('./user');

// Define the Order schema
const orderSchema = new mongoose.Schema(
  // Accepts objects as parameter that defines the fields of the schema
  {
    orderItems: [
      { 
        image: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        art: {  
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Art'
        },
      },
    ],
    shippingAddress: {
      // fullname: {
      //   type: String,
      //   required: true,
      // },
      address: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      request: {
        type: String,
      },
    },
    paymentMethod:{
      type: String,
      enum: ['COD', 'Khalti'],
      default: 'Khalti'
      // required: true,
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    bidAmount: {
      type: Number,
      required: true,
    },
    shippingPrice: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  },
    // accepts options
    {
      timestamps: true, //for logging timestamps when the document is created and modified
    },
);

orderSchema.set("toJSON", {
  transform: (document, returnedDocument) => {
      returnedDocument.id = document._id.toString();
      delete returnedDocument._id;
      delete returnedDocument.password;
      delete returnedDocument.__v;
  },
});

// Create the Shipping Address model
module.exports = mongoose.model("Order", orderSchema);