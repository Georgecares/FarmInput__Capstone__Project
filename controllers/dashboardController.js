const mongoose = require("mongoose");
const InputLog = require("../models/InputLog");
const Group = require("../models/Group");

// @desc    Get Farmer Dashboard Summary
// @route   GET /api/dashboard
exports.getDashboardData = async (req, res) => {
  try {
    const farmerId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Calculate Total Spend & Spending by Category (Epic 3)
    const stats = await InputLog.aggregate([
      { $match: { farmer: farmerId } },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
    ]);

    // 2. Get Recent Activity (Epic 2)
    const recentPurchases = await InputLog.find({ farmer: farmerId })
      .sort("-purchaseDate")
      .limit(5);

    // 3. Find Nearby Buying Groups (Epic 5)
    const nearbyGroups = await Group.find({
      status: "active",
    }).limit(3);

    res.status(200).json({
      success: true,
      data: {
        spendingSummary: stats, // Will contain fertilizer data!
        recentPurchases,
        nearbyGroups,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
