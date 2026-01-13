const Input = require('../models/Input');
const PriceRecord = require('../models/PriceRecord');
const Notification = require('../models/Notification');

const listProducts = async (req, res, next) => {
  try {
    const { input_type, limit = 50 } = req.query;
    const q = input_type ? { category: input_type } : {};
    const items = await Input.find(q).limit(parseInt(limit, 10)).lean();
    res.json({ items });
  } catch (err) {
    next(err);
  }
};

const priceComparison = async (req, res, next) => {
  try {
    const { id } = req.params;
    const records = await PriceRecord.find({ product_id: id }).lean();
    if (!records.length) return res.json({ regional_avg: 0, low: 0, high: 0, sources: { farmers: 0, suppliers: 0 } });

    const prices = records.map((r) => r.price);
    const regional_avg = Math.round(prices.reduce((s, v) => s + v, 0) / prices.length);
    const low = Math.min(...prices);
    const high = Math.max(...prices);
    const farmers = records.filter((r) => r.source_type === 'farmer').length;
    const suppliers = records.filter((r) => r.source_type === 'supplier').length;

    res.json({ regional_avg, low, high, sources: { farmers, suppliers } });
  } catch (err) {
    next(err);
  }
};

const productSources = async (req, res, next) => {
  try {
    const { id } = req.params;
    const records = await PriceRecord.find({ product_id: id }).select('source_type region').lean();
    const farmers = records.filter((r) => r.source_type === 'farmer').length;
    const suppliers = records.filter((r) => r.source_type === 'supplier').length;
    res.json({ farmers, suppliers });
  } catch (err) {
    next(err);
  }
};

// Price alert trigger (simple threshold-based)
const triggerPriceAlert = async (req, res, next) => {
  try {
    const { product_id, threshold_percent } = req.body;
    const records = await PriceRecord.find({ product_id }).sort({ recorded_at: -1 }).limit(10).lean();
    if (records.length < 2) return res.json({ triggered: false });

    const latest = records[0].price;
    const prev = records[1].price;
    const change = ((latest - prev) / prev) * 100;

    if (Math.abs(change) >= threshold_percent) {
      // In real system, target users by region/crop; here we notify all for demo
      await Notification.create({
        user_id: req.user._id,
        message: `Price alert: product changed by ${Math.round(change)}%`,
        type: 'price_alert'
      });
      return res.json({ triggered: true, change: Math.round(change) });
    }
    res.json({ triggered: false, change: Math.round(change) });
  } catch (err) {
    next(err);
  }
};

module.exports = { listProducts, priceComparison, productSources, triggerPriceAlert };
