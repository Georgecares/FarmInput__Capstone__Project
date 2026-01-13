const mongoose = require("mongoose");

const inputSchema = new mongoose.Schema({
  name: String,

  category: {
    type: String,
    enum: ["seeds", "fertilizer", "pesticides", "equipment","herbicides"],
    required: true, 
    index: true
  },
  unit_type: { 
    type: String, 
    enum:["bags", "liters", "kg"],
    required: true 
  },
    retail_price: { type: Number, default: 0 }, 
    description: { type: String } }, { timestamps: true }
);

module.exports = mongoose.model("Input", inputSchema);
