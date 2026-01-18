const mongoose = require('mongoose');
const InputLog = require('../models/InputLog');

// GET /api/inputs/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await InputLog.distinct('category', { user: req.user._id });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// GET /api/inputs?category=seed
exports.getInputsByCategory = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { user: req.user._id };
    if (category) filter.category = category;
    const logs = await InputLog.find(filter);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

// POST /api/inputs/log
exports.logInput = async (req, res, next) => {
  try {
    const {
      category,
      quantity,
      unit,
      unit_price,
      purchase_date,
      notes,
      supplier_id
    } = req.body;

    const log = new InputLog({
      category,
      quantity,
      unit,
      unit_price,
      purchase_date,
      notes,
      supplier_id,
      user: req.user._id
    });

    await log.save();
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
};

// PUT /api/inputs/log/:id
exports.updateInputLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid log Id'})
    }
    const log = await InputLog.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json(log);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/inputs/log/:id
exports.deleteInputLog = async (req, res, next) => {
  try {
    const log = await InputLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json({ message: 'Log deleted successfully' });
  } catch (err) {
    next(err);
  }
};
