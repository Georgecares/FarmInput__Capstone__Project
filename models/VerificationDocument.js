const mongoose = require('mongoose');

const verificationDocumentSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  doc_type: { 
    type: String, 
    enum: ['farmer_certificate','cooperative_id','business_license'], 
    required: true
   },

  file_url: { type: String, required: true },

  status: { 
    type: String, 
    enum: ['pending','approved','rejected'], 
    default: 'pending' 
  },
  reviewed_by: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { timestamps: true });

module.exports = mongoose.model('VerificationDocument', verificationDocumentSchema);
