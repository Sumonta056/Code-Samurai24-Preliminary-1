const mongoose = require("mongoose");

const coordsSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

module.exports = mongoose.model("Coords", coordsSchema);
