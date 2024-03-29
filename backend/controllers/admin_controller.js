// admin-controller.js
const User = require("../models/user");
const Bid = require("../models/bid");
const Art = require("../models/art");
const Order = require("../models/order");

exports.getDashboardSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalArts = await Art.countDocuments();
    const totalBid = await Bid.countDocuments();
    const totalOrder = await Order.countDocuments();

    // Get counts for pending, winning, and losing bid status
    const pendingBidStatus = await User.countDocuments({
      bidStatus: "Pending",
    });
    const winningBidStatus = await User.countDocuments({
      bidStatus: "Winner",
    });
    const losingBidStatus = await User.countDocuments({
      bidStatus: "Loser",
    });

    res.json({
      totalUsers,
      totalArts,
      totalBid,
      totalOrder,
      pendingBidStatus,
      winningBidStatus,
      losingBidStatus,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// View all users
exports.viewAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password from the results
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    User.findByIdAndDelete(req.params.userId)
    .then((reply) => res.status(204).end())
    .catch(next);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
