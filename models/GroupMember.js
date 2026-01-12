const mongoose = require("mongoose");

const groupMemberSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contributionQuantity: { type: Number, required: true }, // How much this specific farmer needs
    isVerified: { type: Boolean, default: false }, // Tie into Epic 9

  },
  { timestamps: true }
);

module.exports = mongoose.model("GroupMember", groupMemberSchema);


// const mongoose = require("mongoose");

// const groupMemberSchema = new mongoose.Schema(
//   {
//     group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },

//     farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

//     quantity: Number,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("GroupMember", groupMemberSchema);

