const { count } = require("console")
const ProductModel= require("../models/productModel")

const createProduct= async function (req, res) {
    let data= req.body

    let savedData= await ProductModel.create(data)
    res.send({msg: savedData})
}

// const getProduct= async function (req, res) {
//     let allBooks= await BookModel.find( {authorName : "HO" } )
//     console.log(allBooks)
//     if (allBooks.length > 0 )  res.send({msg: allBooks, condition: true})
//     else res.send({msg: "No books found" , condition: false})
// }






module.exports.createProduct= createProduct
// module.exports.getBooksData= getBooksData
// module.exports.updateBooks= updateBooks
// module.exports.deleteBooks= deleteBooks
