const Supplier = require('../models/Supplier');
const Input = require('../models/Input');
const SupplierReview = require('../models/supplierReview');
const { requireRole } = require('../middleware/authMiddleware');

const listSuppliers = async (req, res, next) => {
  try {
    const { input_id, state, lga } = req.query;
    const q = {
      ...(state ? { 'location.state': state } : {}),
      ...(lga ? { 'location.lga': lga } : {})
    };
    let suppliers = await Supplier.find(q).lean();

    if (input_id) {
      suppliers = suppliers.filter((s) => s.products.some((p) => String(p.input_id) === String(input_id)));
    }

    res.json({ suppliers });
  } catch (err) {
    next(err);
  }
};

const supplierProducts = async (req, res, next) => {
  try {
    const supplier = await Supplier.findOne({ user_id: req.user._id }).populate('products.input_id', 'name category unit_type').lean();
    if (!supplier) return res.status(404).json({ error: 'Supplier profile not found' });
    res.json({ products: supplier.products });
  } catch (err) {
    next(err);
  }
};

const addSupplierProduct = async (req, res, next) => {
  try {
    const { input_id, price, bulk_discount_percent, min_bulk_quantity } = req.body;
    const supplier = await Supplier.findOne({ user_id: req.user._id });
    if (!supplier) return res.status(404).json({ error: 'Supplier profile not found' });

    supplier.products.push({ input_id, price, bulk_discount_percent, min_bulk_quantity });
    await supplier.save();
    res.status(201).json({ added: true });
  } catch (err) {
    next(err);
  }
};

const compareSuppliers = async (req, res, next) => {
  try {
    const { input_id } = req.query;
    if (!input_id) return res.status(400).json({ error: 'input_id required' });

    const suppliers = await Supplier.find({ 'products.input_id': input_id }).lean();
    const comparison = suppliers.map((s) => {
      const product = s.products.find((p) => String(p.input_id) === String(input_id));
      return {
        supplier_id: s._id,
        name: s.name,
        price: product.price,
        bulk_discount_percent: product.bulk_discount_percent,
        min_bulk_quantity: product.min_bulk_quantity
      };
    });

    res.json({ comparison });
  } catch (err) {
    next(err);
  }
};

const reviewSupplier = async (req, res, next) => {
  try {
    const { supplier_id, rating, comment } = req.body;
    if (!supplier_id || !rating) return res.status(400).json({ error: 'supplier_id and rating required' });

    await SupplierReview.create({ supplier_id, user_id: req.user._id, rating, comment });
    res.status(201).json({ reviewed: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { listSuppliers, supplierProducts, addSupplierProduct, compareSuppliers, reviewSupplier };
