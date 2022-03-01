const { count } = require("console");
const BookModel= require("../models/bookModel");
const AuthorModel = require("../models/authorModel");
const bookModel = require("../models/bookModel");

const createAuthor= async function (req, res) {
    let author= req.body
    let authorData= await AuthorModel.create(author);
    res.send({msg: authorData})
}
const createBook= async function (req, res) {
    let data= req.body
    let savedData= await BookModel.create(data)
    res.send({msg: savedData})
}

const booksFromAuthor= async function (req, res) {
    let authorName= req.body
    let savedData= await AuthorModel.findOne(authorName).select({author_id:1,_id:0})
    let id = savedData.author_id;
    let writtenBooks = await BookModel.find(savedData).select({bookName:1,_id:0});
    
    res.send({msg: writtenBooks})
}


const twoStates= async function (req, res) {
    
    let savedData= await BookModel.findOneAndUpdate({bookName: "Two states"},{$set:{price:100}},{new:true}).select({author_id:1, price:1, _id:0})
    let id = savedData.author_id
    let name = await AuthorModel.find({author_id:{$eq:id}}).select({_id:0, author_name:1})
    let reqdData = {"author_name":name[0].author_name,"updatedPrice":savedData.price}
    res.send({msg: reqdData})
}

// Find the books which costs between 50-100(50,100 inclusive) and respond back 
// with the author names of respective books.. 
// bookModel.find( { price : { $gte: 50}  ,  price: {$lte: 100} } ) // WRONG
// bookModel.find( { price : { $gte: 50, $lte: 100} } ).select({ author_id :1})..
// run a map(or forEach) loop and get all the authorName corresponding to the 
// authorId’s ( by querying authorModel)
const needBooks= async function (req, res) {
    
    let savedData= await BookModel.find({price:{$gte:50,$lte:100}}).select({author_id:1, _id:0})
    let arr=[];
    console.log(savedData);
    for (let i=0;i<savedData.length;i++){
        let neededAuthor = await AuthorModel.findOne(savedData[i]).select({author_name:1, _id:0})
        let k = neededAuthor.author_name;
        arr.push(k);
    }console.log(arr)
    res.send({msg: arr})
}




module.exports.createAuthor= createAuthor
module.exports.createBook= createBook
module.exports.booksFromAuthor= booksFromAuthor
module.exports.twoStates= twoStates
module.exports.needBooks=needBooks

