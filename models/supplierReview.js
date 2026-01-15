const mongoose = require('mongoose');

const supplierReviewSchema = new mongoose.Schema(
  {
    supplier_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Supplier', 
      required: true 
    },
    user_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String }
  },
  { timestamps: true }
);

supplierReviewSchema.index({ supplier_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('SupplierReview', supplierReviewSchema);
