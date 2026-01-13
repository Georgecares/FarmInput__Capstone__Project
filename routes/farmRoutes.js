const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getFarm, updateFarm } = require('../controllers/farmController');

const router = express.Router();

router.get('/', protect, getFarm);
router.patch('/', protect, updateFarm);

module.exports = router;
