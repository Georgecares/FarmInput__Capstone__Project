const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },

    amount: Number,

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
