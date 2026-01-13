const Farm = require('../models/Farm');

const getFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({ user_id: req.user._id }).lean();
    res.json({ farm });
  } catch (err) {
    next(err);
  }
};

const updateFarm = async (req, res, next) => {
  try {
    const { size_hectares, primary_crops, livestock } = req.body;
    const farm = await Farm.findOneAndUpdate(
      { user_id: req.user._id },
      { $set: { size_hectares, primary_crops, livestock } },
      { upsert: true, new: true }
    ).lean();
    res.json({ farm });
  } catch (err) {
    next(err);
  }
};

module.exports = { getFarm, updateFarm };
