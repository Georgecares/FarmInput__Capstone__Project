const User = require("../models/User");
const Farm = require("../models/Farm")

// GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean(); 
    const farm = await Farm.findOne({ user_id: req.user._id }).lean(); 
    res.json({ success: true, user, farm});
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { full_name, email, location, farm } = req.body;

    if (email && email !== req.user.email) {
      const exists = await User.findOne({ email }).lean();
      if (exists) return res.status(409).json({ error: 'Email already in use' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { full_name, email, location } },
      { new: true }
    ).lean();

    if (farm) {
      await Farm.findOneAndUpdate(
        { user_id: req.user._id },
        { $set: { size_hectares: farm.size_hectares, primary_crops: farm.primary_crops || [], livestock: farm.livestock || [] } },
        { upsert: true }
      );
    }

    res.json({ user: updatedUser });
  } catch (err) {
      res.status(500).json({ success: false, message: "Server Error" });
  }
};

const discoverFarmers = async (req, res, next) => {
  try {
    const { crop, state, lga } = req.query;
    const farmMatch = {};
    if (crop) farmMatch.primary_crops = crop;

    const pipeline = [
      { $match: farmMatch },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $match: {
          ...(state ? { 'user.location.state': state } : {}),
          ...(lga ? { 'user.location.lga': lga } : {})
        }
      },
      { $project: { user_id: 1, size_hectares: 1, primary_crops: 1, 'user.full_name': 1, 'user.location': 1 } },
      { $limit: 50 }
    ];

    const results = await Farm.aggregate(pipeline);
    res.json({ farmers: results });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, discoverFarmers };
