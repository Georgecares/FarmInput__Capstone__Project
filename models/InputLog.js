// models/InputLog.js
const mongoose = require('mongoose');

const inputLogSchema = new mongoose.Schema({
  category: { type: String, required: true },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit_price: { type: Number, required: true },
  purchase_date: { type: Date, required: true },
  notes: { type: String },
  supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('InputLog', inputLogSchema);
