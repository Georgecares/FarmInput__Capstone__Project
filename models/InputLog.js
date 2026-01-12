const mongoose = require("mongoose");

const inputLogSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["Seeds", "Fertilizer", "Pesticides", "Equipment"],
      required: true,
    },
    itemName: { type: String, required: true }, // e.g., "NPK 15-15-15"
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }, // e.g., "kg", "bags", "liters"
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number }, // We'll calculate this
    supplierName: { type: String },
    location: {
      state: { type: String, required: true },
      lga: { type: String, required: true },
    },
    purchaseDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


// Pre-save hook to calculate total cost
inputLogSchema.pre("save", async function () {
  this.totalPrice = this.quantity * this.unitPrice;
  // No next() needed if you don't include it in arguments
});

module.exports = mongoose.model("InputLog", inputLogSchema);

// const mongoose = require("mongoose");

// const inputLogSchema = new mongoose.Schema(
//   {
//     farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

//     inputCategory: {
//       type: String,
//       enum: ["seeds", "fertilizer", "pesticides", "equipment"],
//     },

//     quantity: Number,
//     unit: String,
//     unitPrice: Number,

//     totalCost: Number,

//     supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },

//     purchaseDate: Date,

//     location: {
//       state: String,
//       lga: String,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("InputLog", inputLogSchema);

