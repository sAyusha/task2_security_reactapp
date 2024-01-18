const mongoose = require("mongoose")
const User = require('./user');

const bidSchema = new mongoose.Schema({
    bidAmount: {
        type: Number,
        required: true
    },
    bidArt: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Art'
        },

    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
})

module.exports = mongoose.model("Bid", bidSchema)