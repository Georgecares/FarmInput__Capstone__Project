const Input = require('../models/Input');
const Supplier = require('../models/Supplier');
const InputLog = require('../models/InputLog');
const Transaction = require('../models/Transaction');
const { logActivity } = require('../utils/logger');

const listCategories = async (_req, res) => {
  res.json({ categories: ['fertilizer', 'seeds', 'pesticides', 'herbicides', 'equipment'] });
};

const listNamesByCategory = async (req, res, next) => {
  try {
    const { category } = req.query;
    const items = await Input.find({ category }).select('name unit_type retail_price description').lean();
    res.json({ items });
  } catch (err) {
    next(err);
  }
};

const listSuppliers = async (req, res, next) => {
  try {
    const { search = '', state, lga } = req.query;
    const q = {
      ...(search ? { name: new RegExp(search, 'i') } : {}),
      ...(state ? { 'location.state': state } : {}),
      ...(lga ? { 'location.lga': lga } : {})
    };
    const suppliers = await Supplier.find(q).limit(50).lean();
    res.json({ suppliers });
  } catch (err) {
    next(err);
  }
};

const logNewInput = async (req, res, next) => {
  try {
    const { input_id, quantity, unit_price, supplier_id, purchase_date, notes } = req.body;
    if (!input_id || !quantity || !unit_price || !purchase_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const input = await Input.findById(input_id).lean();
    if (!input) return res.status(404).json({ error: 'Input not found' });

    const log = await InputLog.create({
      user_id: req.user._id,
      input_id,
      quantity,
      unit_price,
      supplier_id,
      purchase_date,
      notes
    });

    await Transaction.create({
      user_id: req.user._id,
      input_id,
      category: input.category,
      amount: quantity * unit_price,
      quantity,
      purchased_at: purchase_date
    });

    await logActivity(req.user._id, 'input_added', `Added ${input.name} (₦${quantity * unit_price})`);
    res.status(201).json({ log_id: log._id });
  } catch (err) {
    next(err);
  }
};

const editInputLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, unit_price, supplier_id, purchase_date, notes } = req.body;

    const log = await InputLog.findOne({ _id: id, user_id: req.user._id });
    if (!log) return res.status(404).json({ error: 'Log not found' });

    log.quantity = quantity ?? log.quantity;
    log.unit_price = unit_price ?? log.unit_price;
    log.supplier_id = supplier_id ?? log.supplier_id;
    log.purchase_date = purchase_date ?? log.purchase_date;
    log.notes = notes ?? log.notes;
    await log.save();

    // Update mirrored transaction
    await Transaction.findOneAndUpdate(
      { user_id: req.user._id, input_id: log.input_id, purchased_at: log.purchase_date },
      { $set: { amount: log.quantity * log.unit_price, quantity: log.quantity } }
    );

    res.json({ updated: true });
  } catch (err) {
    next(err);
  }
};

const deleteInputLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const log = await InputLog.findOneAndDelete({ _id: id, user_id: req.user._id });
    if (!log) return res.status(404).json({ error: 'Log not found' });

    await Transaction.deleteMany({ user_id: req.user._id, input_id: log.input_id, purchased_at: log.purchase_date });
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { listCategories, listNamesByCategory, listSuppliers, logNewInput, editInputLog, deleteInputLog };
