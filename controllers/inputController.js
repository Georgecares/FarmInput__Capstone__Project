const mongoose = require('mongoose');
const Input = require('../models/Input');
const Supplier = require('../models/Supplier');
const InputLog = require('../models/InputLog');
const Transaction = require('../models/Transaction');
const { logActivity } = require('../utils/logger');

/**
 * GET /inputs/categories
 */
const listCategories = async (_req, res) => {
  res.json({
    categories: ['fertilizer', 'seeds', 'pesticides', 'herbicides', 'equipment']
  });
};

/**
 * GET /inputs/names?category=fertilizer
 */
const listNamesByCategory = async (req, res, next) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    const items = await Input.find({ category })
      .select('name unit_type retail_price description')
      .lean();

    res.json({ items });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /inputs/suppliers
 */
const listSuppliers = async (req, res, next) => {
  try {
    const { search = '', state, lga } = req.query;

    const query = {
      ...(search && { name: new RegExp(search, 'i') }),
      ...(state && { 'location.state': state }),
      ...(lga && { 'location.lga': lga })
    };

    const suppliers = await Supplier.find(query).limit(50).lean();
    res.json({ suppliers });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /inputs/log
 */
const logNewInput = async (req, res, next) => {
  try {
    const {
      input_id,
      quantity,
      unit_price,
      supplier_id,
      purchase_date,
      notes
    } = req.body;


    /* ---------- Required field validation ---------- */
    if (
      input_id === undefined ||
      quantity === undefined ||
      unit_price === undefined ||
      purchase_date === undefined
    ) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    /* ---------- ObjectId validation ---------- */
    if (!mongoose.Types.ObjectId.isValid(input_id)) {
      return res.status(400).json({
        error: 'Invalid input_id'
      });
    }

    if (supplier_id && !mongoose.Types.ObjectId.isValid(supplier_id)) {
      return res.status(400).json({
        error: 'Invalid supplier_id'
      });
    }

    /* ---------- THIS findById (safe) ---------- */
    const input = await Input.findById(input_id).lean();

    if (!input) {
      return res.status(404).json({
        error: 'Input not found'
      });
    }

    /* ---------- Create input log ---------- */
    const log = await InputLog.create({
      user_id: req.user._id,
      input_id,
      quantity,
      unit_price,
      supplier_id,
      purchase_date,
      notes
    });

    /* ---------- Create mirrored transaction ---------- */
    await Transaction.create({
      user_id: req.user._id,
      input_id,
      category: input.category,
      amount: quantity * unit_price,
      quantity,
      purchased_at: purchase_date
    });

    /* ---------- Activity log ---------- */
    await logActivity(
      req.user._id,
      'input_added',
      `Added ${input.name} (₦${quantity * unit_price})`
    );

    res.status(201).json({
      success: true,
      log_id: log._id
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /inputs/log/:id
 */
const editInputLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid log id' });
    }

    const log = await InputLog.findOne({
      _id: id,
      user_id: req.user._id
    });

    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }

    const { quantity, unit_price, supplier_id, purchase_date, notes } = req.body;

    log.quantity = quantity ?? log.quantity;
    log.unit_price = unit_price ?? log.unit_price;
    log.supplier_id = supplier_id ?? log.supplier_id;
    log.purchase_date = purchase_date ?? log.purchase_date;
    log.notes = notes ?? log.notes;

    await log.save();

    await Transaction.findOneAndUpdate(
      {
        user_id: req.user._id,
        input_id: log.input_id,
        purchased_at: log.purchase_date
      },
      {
        $set: {
          amount: log.quantity * log.unit_price,
          quantity: log.quantity
        }
      }
    );

    res.json({ updated: true });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /inputs/log/:id
 */
const deleteInputLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid log id' });
    }

    const log = await InputLog.findOneAndDelete({
      _id: id,
      user_id: req.user._id
    });

    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }

    await Transaction.deleteMany({
      user_id: req.user._id,
      input_id: log.input_id,
      purchased_at: log.purchase_date
    });

    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listCategories,
  listNamesByCategory,
  listSuppliers,
  logNewInput,
  editInputLog,
  deleteInputLog
};
