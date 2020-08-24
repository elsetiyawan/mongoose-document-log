const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historyModel = new mongoose.Schema(
  {
    collectionName: String,
    operation: String,
    data: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model("_history", historyModel);
