const InputLog = require("../models/InputLog");

// @desc    Log a new farm input purchase
// @route   POST /api/inputs
exports.logInput = async (req, res) => {
  try {
    const {
      category,
      itemName,
      quantity,
      unit,
      unitPrice,
      supplierName,
      location,
    } = req.body;

    // 1. Validation
    if (!category || !quantity || !unitPrice) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // 2. Create entry in DB
    const log = await InputLog.create({
      farmer: req.user.id,
      category,
      itemName,
      quantity,
      unit,
      unitPrice,
      supplierName,
      location,
    });

    res.status(201).json({
      success: true,
      data: log,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all logs for the logged-in farmer
// @route   GET /api/inputs
exports.getMyInputs = async (req, res) => {
  try {
    //Sort by most recent purchaseDate
    const logs = await InputLog.find({ farmer: req.user.id }).sort(
      "-purchaseDate"
    );
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
