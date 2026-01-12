const mongoose = require("mongoose");

const inputSchema = new mongoose.Schema({
  name: String,

  category: {
    type: String,
    enum: ["seeds", "fertilizer", "pesticides", "equipment"],
  },
});

module.exports = mongoose.model("Input", inputSchema);

