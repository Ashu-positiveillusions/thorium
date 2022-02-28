const { count } = require("console")
const BookModel= require("../models/bookModel")

const createBook= async function (req, res) {
    let data= req.body

    let savedData= await BookModel.create(data)
    res.send({msg: savedData})
}

const booksList= async function (req, res) {
let allBooks = await BookModel.find().select({bookName:1,
                                                authorName:1,
                                                _id:0
                                            });
    res.send({msg: allBooks})
}

const getBooksInYear = async function(req, res){
    let reqdYear = req.body;
    let sameYearBooks = await BookModel.find(reqdYear);
    res.send({msg:sameYearBooks});
}

const getXINRBooks = async function(req, res){
    
    let samePriceBooks = await BookModel.find({"prices.indianPrice":{$in:["100INR","200INR","500INR"]}});
    // let samePriceBooks = await BookModel.find({"prices.indianPrice":"100INR"},{"prices.indianPrice":"200INR"},{"prices.indianPrice":"500INR"}).count();
//    let samePriceBooks = await BookModel.find({$or: [{"prices.indianPrice":{$eq:"100INR"}},{"prices.indianPrice":{$eq:"200INR"}},{"prices.indianPrice":{$eq:"500INR"}}]});
    res.send({msg:samePriceBooks});
}

const getRandomBooks = async function(req,res){
    let randomBooks = await BookModel.find({$or:[{inStock:{$eq:true}},{totalPages:{$gt: 500}}]});
    res.send({msg:randomBooks});
}

const getParticularBooks = async function(req,res){
    let givenCondition = req.body;

    let particularBooks = await BookModel.find(givenCondition);
    res.send({msg:particularBooks});
}

module.exports.createBook= createBook;
module.exports.booksList= booksList;
module.exports.getBooksInYear= getBooksInYear;
module.exports.getXINRBooks= getXINRBooks;
module.exports.getRandomBooks= getRandomBooks;
module.exports.getParticularBooks = getParticularBooks;