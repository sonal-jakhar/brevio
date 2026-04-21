const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema(
  {
    link: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Link",
      required: true,
      index: true,
    },
    shortCode: {
      type: String,
      required: true,
      index: true,
    },
    ip: {
      type: String,
      default: "unknown",
    },
    country: {
      type: String,
      default: "unknown",
    },
    city: {
      type: String,
      default: "unknown",
    },
    device: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "unknown"],
      default: "unknown",
    },
    browser: {
      type: String,
      default: "unknown",
    },
    os: {
      type: String,
      default: "unknown",
    },
    referrer: {
      type: String,
      default: "direct",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Click", clickSchema);
