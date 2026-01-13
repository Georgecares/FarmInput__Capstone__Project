const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },

    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Input', required: true },

    max_members: { type: Number, required: true, min: 1 },

    current_members: { type: Number, default: 0, min: 0 },

    target_price: { type: Number, required: true, min: 0 },

    savings_percent: { type: Number, default: 0 },

    combined_order: { type: Number, default: 0 },

    status: { 
      type: String, 
      enum: ['open', 'locked', 'expired'], 
      default: 'open', 
      index: true 
    },
    expires_at: { type: Date, required: true },

    location: { state: String, lga: String, village: String },

    crop_focus: { type: String }
  },
  
  { timestamps: true }
);

groupSchema.methods.updateStatus = function () {
  if (this.current_members >= this.max_members) this.status = 'locked';
  if (Date.now() > new Date(this.expires_at).getTime()) this.status = 'expired';
  return this.status;
};

module.exports = mongoose.model('Group', groupSchema);
