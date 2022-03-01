const mongoose1 = require('mongoose');

const authorSchema = new mongoose1.Schema({
    author_id : {type: Number,
        required:true},
    author_name: String,
    age: Number,
    address: String
}, {timestamps: true});

module.exports = mongoose1.model('Authors', authorSchema) ;
