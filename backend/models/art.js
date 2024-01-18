const mongoose = require('mongoose');
const moment = require('moment');
const momentTz = require('moment-timezone');
const User = require('./user');

// Define the Art schema
const artSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
    default: null,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  creator: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true
  },
  startingBid: {
    type: Number,
    required: true,
    default: 0,
  },
  endingDate: {
    type: Date,
    default: Date.now,
    // required: true,
    // default: function () {
    //   // Set default expiration date to 10 minutes more than the current time
    //   return new Date(Date.now() + 75 * 60 * 1000);
    // },
  },
  artExpired: {
    type: Boolean,
    default: false,
  },
  bidAmount: {
    type: Number,
    default: 0
  },
  highestBidAmount: {
    type: Number,
    default: 0
  },
  artType: {
    type: String,
    enum: ['Upcoming', 'Recent'],
    default: 'Recent',
  },
  upcomingDate: {
    type: Date,
    default: Date.now,
    // required: true,
  },
  categories: {
    type: String,
    enum: ['Abstract', 'Painting', 'Drawing', 'Digital', 'Mixed media'],
    default: 'Abstract',
  },
  // isFeatured: {
  //   type: Boolean,
  //   default: false,
  // },    
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Define the virtual property for localEndingDate
artSchema.virtual('localEndingDate').get(function () {
  // Convert the endingDate to local time using moment-timezone
  return momentTz(this.endingDate).tz('Asia/Kathmandu').format();
});

// Define the virtual property for localEndingDate
artSchema.virtual('localUpcomingDate').get(function () {
  // Convert the endingDate to local time using moment-timezone
  return momentTz(this.upcomingDate).tz('Asia/Kathmandu').format();
});

artSchema.set("toJSON", {
  virtuals: true,
  transform: (document, returnedDocument) => {
    returnedDocument.id = document._id.toString();
    delete returnedDocument._id;
    delete returnedDocument.password;
    delete returnedDocument.__v;

    // Include bidAmount in the returned document unconditionally
    returnedDocument.bidAmount = document.bidAmount;

    // Compare bidAmount with existing highestBidAmount
    if (document.bidAmount > document.highestBidAmount && !document.artExpired) {
      returnedDocument.highestBidAmount = document.highestBidAmount;
    } else {
      delete returnedDocument.highestBidAmount;
    }
  },
});

// Add this function to the artSchema
artSchema.methods.checkAndUpdateExpirationStatus = function () {
  if (!this.artExpired && Date.now() > this.endingDate) {
    this.artExpired = true;
    return this.save();
  }
  return Promise.resolve(this);
};

// Create the Art model
module.exports = mongoose.model("Art", artSchema);