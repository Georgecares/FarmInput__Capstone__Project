const mongoose = require("mongoose");
const InputLog = require("../models/InputLog");

// @desc    Get monthly spending trends
// @route   GET /api/spending/trends
exports.getSpendingTrends = async (req, res) => {
  try {
    const farmerId = new mongoose.Types.ObjectId(req.user.id);

    const trends = await InputLog.aggregate([
      { $match: { farmer: farmerId } },
      {
        $group: {
          _id: {
            month: { $month: "$purchaseDate" },
            year: { $year: "$purchaseDate" },
          },
          totalAmount: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }, // Show newest months first
    ]);

    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
