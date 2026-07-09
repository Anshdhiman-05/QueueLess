const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    userId: String,
  username: String,
  serviceName: String,
  tokenNumber: Number,
  status: {
    type: String,
    default: "waiting"
  }
})

module.exports = mongoose.model("Token",tokenSchema)