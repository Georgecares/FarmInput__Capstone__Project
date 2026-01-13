const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { listProducts, priceComparison, productSources, triggerPriceAlert } = require('../controllers/pricingController');

const router = express.Router();

router.get('/products', protect, listProducts);
router.get('/products/:id/price-comparison', protect, priceComparison);
router.get('/products/:id/sources', protect, productSources);
router.post('/alerts/trigger', protect, triggerPriceAlert);

module.exports = router;
