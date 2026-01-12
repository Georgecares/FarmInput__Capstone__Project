const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    businessName: { type: String, required: true },
    contactPhone: { type: String, required: true },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    location: {
      state: { type: String, required: true },
      lga: { type: String, required: true },
    },
    inventory: [
      {
        itemName: String,
        category: String,
        retailPrice: Number,
        bulkPrice: Number,
      },
    ],
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Supplier", supplierSchema);

// const supplierSchema = new mongoose.Schema(
//   {
//     name: String,
//     contactPhone: String,

//     location: {
//       state: String,
//       lga: String,
//     },

//     rating: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Supplier", supplierSchema);

