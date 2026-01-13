const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    action_type: { type: String, required: true }, // e.g., 'input_added', 'group_joined', 'price_alert'

    description: { type: String },
    
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
