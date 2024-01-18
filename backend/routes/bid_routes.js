const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bidController = require('../controllers/bid_controller');

// get all bids
router.get('/', bidController.getAllBids);

// GET /bids/:bid_id
router.get('/:bid_id', bidController.getBid);

// POST /bids
router.post('/:art_id/bid', bidController.placeBid);

module.exports = router;
