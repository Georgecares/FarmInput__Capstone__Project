const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    inputCategory: { type: String, required: true }, // e.g., "Fertilizer"
    targetInput: { type: String, required: true },
    description: { type: String },
    location: {
      state: { type: String, required: true },
      lga: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["open", "locked", "negotiating", "completed", "cancelled"],
      default: "open",
    },
    targetQuantity: { type: Number, required: true },
    currentQuantity: { type: Number, default: 0 },
    deadline: { type: Date, required: true },

    // --- NEW FIELDS FOR UI ---
    targetPrice: { type: Number }, // The bulk price (e.g., 10625)
    marketPrice: { type: Number }, // The retail price (to calc savings)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);


// const mongoose = require("mongoose");

// const groupSchema = new mongoose.Schema(
//   {
//     inputType: String,
//     cropType: String,

//     targetQuantityPerMember: Number,

//     deliveryTimeframe: String,

//     status: {
//       type: String,
//       enum: ["open", "locked", "completed"],
//       default: "open",
//     },

//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Group", groupSchema);
