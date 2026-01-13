const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { spendingSummary, spendingTrends, annualReport } = require('../controllers/spendingController');

const router = express.Router();

router.get('/summary', protect, spendingSummary);
router.get('/trends', protect, spendingTrends);
router.get('/report', protect, annualReport);

module.exports = router;
