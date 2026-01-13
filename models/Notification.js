const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true, 
      index: true 
    },
    message: { type: String, required: true },

    type: { 
      type: String, 
      enum: ['price_alert', 'group_update', 'verification'], required: true 
    },

    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
