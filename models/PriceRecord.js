const mongoose = require("mongoose");

const priceRecordSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Input', required: true, index: true }, 

    inputName: String,

    category: String,

    price: { type: Number, required: true, min: 0 }, 
    
    recorded_at: { type: Date, default: Date.now },

    location: {
      state: String,
      lga: String,
    },

    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PriceRecord", priceRecordSchema);
