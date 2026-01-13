const Transaction = require('../models/Transaction');
const { trendPercent } = require('../utils/calculateTrends');

const spendingSummary = async (req, res, next) => {
  try {
    const { period = 'monthly' } = req.query;
    const now = new Date();
    const start = new Date(now);
    start.setMonth(now.getMonth() - 3);

    const pipeline = [
      { $match: { user_id: req.user._id, purchased_at: { $gte: start, $lte: now } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ];

    const data = await Transaction.aggregate(pipeline);
    const total = data.reduce((sum, x) => sum + x.total, 0);

    const breakdown = data.map((x) => ({
      category: x._id,
      amount: x.total,
      percent: total ? Math.round((x.total / total) * 100) : 0
    }));

    res.json({ period, total, breakdown });
  } catch (err) {
    next(err);
  }
};

const spendingTrends = async (req, res, next) => {
  try {
    const { period = 'monthly' } = req.query;
    const now = new Date();

    const currentStart = new Date(now);
    currentStart.setMonth(now.getMonth() - 3);

    const prevEnd = new Date(currentStart);
    const prevStart = new Date(prevEnd);
    prevStart.setMonth(prevEnd.getMonth() - 3);

    const agg = async (start, end) =>
      Transaction.aggregate([
        { $match: { user_id: req.user._id, purchased_at: { $gte: start, $lte: end } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } }
      ]);

    const [cur, prev] = await Promise.all([agg(currentStart, now), agg(prevStart, prevEnd)]);
    const prevMap = new Map(prev.map((x) => [x._id, x.total]));

    const trends = cur.map((x) => ({
      category: x._id,
      current: x.total,
      previous: prevMap.get(x._id) || 0,
      trend_percent: trendPercent(x.total, prevMap.get(x._id) || 0)
    }));

    res.json({ period, trends });
  } catch (err) {
    next(err);
  }
};

const annualReport = async (req, res, next) => {
  try {
    const { year } = req.query;
    const start = new Date(`${year}-01-01T00:00:00Z`);
    const end = new Date(`${year}-12-31T23:59:59Z`);

    const pipeline = [
      { $match: { user_id: req.user._id, purchased_at: { $gte: start, $lte: end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, qty: { $sum: '$quantity' } } }
    ];

    const data = await Transaction.aggregate(pipeline);
    const total = data.reduce((sum, x) => sum + x.total, 0);

    res.json({ year, total, categories: data });
  } catch (err) {
    next(err);
  }
};

module.exports = { spendingSummary, spendingTrends, annualReport };
