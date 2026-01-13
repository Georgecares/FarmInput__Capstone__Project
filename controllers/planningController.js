const Farm = require('../models/Farm');
const Input = require('../models/Input');
const { forecastInputs } = require('../utils/forecast');

const estimateSeason = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({ user_id: req.user._id }).lean();
    if (!farm) return res.status(404).json({ error: 'Farm not found' });

    const { crop = farm.primary_crops?.[0] || 'Maize' } = req.query;

    // Demo usage catalog; replace with DB-driven agronomic recommendations
    const usageCatalog = [
      { category: 'fertilizer', unit: 'bags', quantityPerHa: 2 },
      { category: 'seeds', unit: 'kg', quantityPerHa: 20 },
      { category: 'pesticides', unit: 'liters', quantityPerHa: 1 }
    ];

    const forecasts = forecastInputs(farm.size_hectares, crop, usageCatalog);

    // Attach estimated costs using Input retail prices
    const inputs = await Input.find({ category: { $in: usageCatalog.map((u) => u.category) } }).lean();
    const priceMap = new Map(inputs.map((i) => [i.category, i.retail_price || 0]));
    const withCosts = forecasts.map((f) => ({
      ...f,
      estimated_cost: Math.round(f.estimated_quantity * (priceMap.get(f.category) || 0))
    }));

    const total_cost = withCosts.reduce((sum, x) => sum + x.estimated_cost, 0);
    res.json({ crop, size_hectares: farm.size_hectares, items: withCosts, total_cost });
  } catch (err) {
    next(err);
  }
};

const seasonalSummary = async (req, res, next) => {
  try {
    // For demo, reuse spending summary with seasonal period
    req.query.period = 'seasonal';
    const Spending = require('./spendingController');
    return Spending.spendingSummary(req, res, next);
  } catch (err) {
    next(err);
  }
};

module.exports = { estimateSeason, seasonalSummary };
