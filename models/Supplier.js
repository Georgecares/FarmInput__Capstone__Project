const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    location: { state: String, lga: String, village: String },
    contact_info: { type: String },
    verified: { type: Boolean, default: false },
    products: [
      {
        input_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Input' },
        price: { type: Number, required: true },
        bulk_discount_percent: { type: Number, default: 0 },
        min_bulk_quantity: { type: Number, default: 0 }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Supplier', supplierSchema);
