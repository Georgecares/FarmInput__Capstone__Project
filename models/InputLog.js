const mongoose = require('mongoose');

const inputLogSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    input_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Input', required: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: String,
    unit_price: { type: Number, required: true, min: 0 },
    supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    purchase_date: { type: Date, required: true },
    notes: { type: String }
  },
  { timestamps: true }
);

inputLogSchema.virtual('amount').get(function () {
  return this.quantity * this.unit_price;
});

module.exports = mongoose.model('InputLog', inputLogSchema);


