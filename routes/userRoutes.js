const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { getProfile, updateProfile, discoverFarmers } = require("../controllers/userController");

// Protected route → anyone logged in
router.get("/profile", protect, getProfile);

// Protected route → update your own profile
router.patch("/profile", protect, updateProfile);


router.get('/discover', protect, discoverFarmers); 


// Admin-only route
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ success: true, message: "Admin content only" });
});

module.exports = router;
