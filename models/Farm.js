const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema(
 { user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, 
 size_hectares: { type: Number, default: 0 }, 
 primary_crops: [{ type: String }], 
 farm_size: [{type: string}],
 livestock: [{ type: String }] }, { timestamps: true },
);

module.exports = mongoose.model("Farm", farmSchema);
