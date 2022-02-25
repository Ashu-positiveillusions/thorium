const mongoose = require('mongoose');
const { stringify } = require('querystring');

const bookSchema = new mongoose.Schema( {
    bookName: String,
    authorName: String,
    category: String,
    year: Number
}, { timestamps: true });

module.exports = mongoose.model('Books', bookSchema) //users



// String, Number
// Boolean, Object/json, array