const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const books = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim:true
    },
    bookCover: {type:String, required:true, trim:true},
    excerpt: { type: String, required: true,trim:true },
    userId: {
      type: ObjectId,
      ref: "Users",
      required: true,
      trim:true
    },
    ISBN: { type: String, required: true, unique: true,trim:true },
    category: { type: String, required: true,trim:true },
    subcategory: { type: [String], required: true },
    reviews: { type: Number, default: 0,trim:true},//"Holds number of reviews of this book" },
    deletedAt: Date,
    isDeleted: { type: Boolean, default: false },
    releasedAt: { type: Date, required: true, format: "YYYY-MM-DD",trim:true},
  },
  { timestamps: true }
);
module.exports = mongoose.model("Books", books);