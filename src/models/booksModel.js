const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const books = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    excerpt: { type: String, required: true },
    userId: {
      type: ObjectId,
      ref: "Users",
      required: true,
    },
    ISBN: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    subcategory: { type: [String], required: true },
    reviews: { type: Number, default: 0, comment:"Holds number of reviews of this book" },
    deletedAt: Date,
    isDeleted: { type: Boolean, default: false },
    releasedAt: { type: Date, required: true, format: "YYYY-MM-DD" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Books", books);