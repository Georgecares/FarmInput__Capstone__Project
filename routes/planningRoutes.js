const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { estimateSeason, seasonalSummary } = require('../controllers/planningController');

const router = express.Router();

router.get('/estimate', protect, estimateSeason);
router.get('/seasonal-summary', protect, seasonalSummary);

module.exports = router;
