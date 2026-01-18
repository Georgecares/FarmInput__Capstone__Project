const mongoose = require("mongoose");
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
    const userId = req.user._id

    const { full_name, email, location, farm_size, phone, primary_crops } = req.body;


    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { full_name, email, phone, location },
      { new: true }
    ).lean();

    //update farm
    const updatedFarm = await Farm.findOneAndUpdate(
      { user_id: userId },
      { farm_size, primary_crops },
      { new: true }
    ).lean();

    if (!updatedFarm) {
      updatedFarm = await Farm.create({
        user_id: userId,
        farm_size,
        primary_crops
      });
    }

    res.json({message: "profile update successful", user: updatedUser, farm: updatedFarm });
  } catch (err) {
      res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getProfile, updateProfile };
