const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, 

    input_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Input' }, 
    category: { type: String, required: true }, 

    amount: { type: Number, required: true, min: 0 }, 

    quantity: { type: Number, min: 0 }, 
    
    purchased_at: { type: Date, required: true },

    type: {
      type: String,
      enum: ["individual", "group"],
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
