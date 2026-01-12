const InputLog = require("../models/InputLog");

// @desc    Compare my price vs regional average
// @route   GET /api/pricing/compare
exports.getPriceComparison = async (req, res) => {
  try {
    // We get these from query params: /api/pricing/compare?category=Fertilizer&state=Kano&lga=Bebeji
    const { category, state, lga } = req.query;

    if (!category || !state || !lga) {
      return res.status(400).json({
        success: false,
        message: "Please provide category, state, and lga",
      });
    }

    const regionalData = await InputLog.aggregate([
      {
        $match: {
          category: category,
          "location.state": state,
          "location.lga": lga,
        },
      },
      {
        $group: {
          _id: "$category",
          avgPrice: { $avg: "$unitPrice" },
          minPrice: { $min: "$unitPrice" },
          maxPrice: { $max: "$unitPrice" },
          totalEntries: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: regionalData[0] || {
        message: "Not enough data for this region yet",
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//