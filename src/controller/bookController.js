const BooksModel=require("../models/booksModel");
const UserModel=require("../models/userModel");
const ReviewModel=require("../models/reviewModel");
const moment = require('moment')
const { get } = require("../routes/route");
var ObjectId = require("mongoose").Types.ObjectId;

const isValidObjectId= function (a){
    if((ObjectId.isValid(a)))//checking for 12 bytes id in input value 
    {  
        let b =  (String)(new ObjectId(a))//converting input value in valid object Id
        
        if(b == a) //comparing converted object Id with input value
        {       
            return true
        }else{
                return false;
            }
    }else{
        return false
    }
}

const createBooks=async function(req,res){
    
try{
    let bookData=req.body;
    
    // checking if we get any data from request body
    if(Object.keys(bookData).length==0) return res.status(400).send({status:false, message:"Please enter book details"})

    let subcategory=bookData.subcategory;
    delete bookData.subcategory;

    let keys = Object.keys(bookData);
    for(let i=0; i<keys.length; i++){
        if(!(bookData[keys[i]])) return res.status(400).send({status:false, message:`Please provide proper ${keys[i]} to create`})
        bookData[keys[i]]=bookData[keys[i]].trim();
        if(!(bookData[keys[i]])) return res.status(400).send({status:false, message:`Please provide proper ${keys[i]} to create`})
    }

    // destructuring to get all values in various variables
    let {title, excerpt, ISBN, category, userId, releasedAt} = bookData;
    bookData.subcategory=subcategory;

    // validation which are must required
    if(!title) return res.status(400).send({status: false, message: "Please provide proper title to create."})
    if(!excerpt) return res.status(400).send({status: false, message: "Please provide proper excerpt to create."})
    if(!userId) return res.status(400).send({status: false, message: "Please provide proper userId to create."})
    if(!ISBN) return res.status(400).send({status: false, message: "Please provide proper ISBN to create."})
    if(!category) return res.status(400).send({status: false, message: "Please provide proper category to create."})
    if(!subcategory) return res.status(400).send({status: false, message: "Please provide proper subcategory to create."})
    if(!releasedAt) return res.status(400).send({status: false, message: "Please provide proper releasedAt date to create."})

    //validation of subcategory    
    subcategory = bookData.subcategory;
    if(subcategory.length==0) return res.status(400).send({status: false, message: "Please provide proper subcategory to create."})

    //checks for valid userId format
    let checkObjectId = isValidObjectId(userId)
    if(!checkObjectId) return res.status(400).send({status:false, message: "Please enter a valid userId"})

    //checks for valid user
    let user= await UserModel.findById(userId)
    if(!user) return res.status(404).send({status: false, message: "User doesn't exists"})

    // duplicity check of title
    let duplicateTitle = await BooksModel.findOne({title:title});
    if(duplicateTitle) return res.status(400).send({status:false,message:"title already exists."})

    // duplicity check of ISBN
    let duplicateISBN = await BooksModel.findOne({ISBN:ISBN});
    if(duplicateISBN) return res.status(400).send({status:false,message:"ISBN already exists."})

    // date validation for releasedAt
   // releasedAt=releasedAt.format()
    let validity = moment(releasedAt, "YYYY-MM-DD",true).isValid();
    if(!validity) return res.status(400).send({status:false,message:"input a valid date in YYYY-MM-DD format."})
    
    let book=await BooksModel.create(bookData);
    return res.status(201).send({status:true, message:'Success',data:book})

}catch(error){
    return res.status(500).send({status:false, Error: error.message})
}
}

const getBooks=async function(req,res)
{
try{
    let filter=req.query;

    //if no filter then return all books which aren't deleted
    if(Object.keys(filter).length==0) 
    {
        let books=await BooksModel.find({isDeleted:false}).select({_id:1, title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1}).sort({title:1})
        if(books.length==0) return res.status(404).send({status:false, message: "No Book found"})  

        return res.status(200).send({status:true,message: 'Books list', data:books})
    }

    let keys = Object.keys(filter);
    for(let i=0; i<keys.length; i++){
        if(!(filter[keys[i]])) return res.status(400).send({status:false, message:"Please provide proper filters."})
        filter[keys[i]]=filter[keys[i]].trim();
        if(!(filter[keys[i]])) return res.status(400).send({status:false, message:"Please provide proper filters."})

    }
    if(keys.includes("userId")){
        let userId = filter.userId
        let checkObjectId = isValidObjectId(userId)
        if(!checkObjectId) return res.status(400).send({status:false, message: "Please enter a valid userId"})
    }

    if(keys.includes("subcategory")){
        let array=filter.subcategory;
        delete filter.subcategory;

        if(Object.keys(filter).length!=0){
        let books=await BooksModel.find({$and:[{isDeleted:false}, filter,{subcategory:{$in:array}}]}).select({_id:1, title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1}).sort({title:1})
        if(books.length==0) return res.status(404).send({status:false, message: "No Book found"})  
    
        return res.status(200).send({status:true,message: 'Books list', data:books})
        }else{
            let books=await BooksModel.find({$and:[{isDeleted:false}, {subcategory:{$in:array}}]}).select({_id:1, title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1}).sort({title:1})
            if(books.length==0) return res.status(404).send({status:false, message: "No Book found"})  
        
            return res.status(200).send({status:true,message: 'Books list', data:books}) 
        }

    }
    //return books after applying queries
    let books=await BooksModel.find({$and:[{isDeleted:false}, filter]}).select({_id:1, title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1}).sort({title:1})
    if(books.length==0) return res.status(404).send({status:false, message: "No Book found"})  

    return res.status(200).send({status:true,message: 'Books list', data:books})

}catch(error){
    return res.status(500).send({status:false, Error: error.message})
}
}


const getBooksByBookId= async function(req,res)
{
try{
    let bookId=req.params.bookId;

    //checks for valid bookId format
    let checkObjectId = isValidObjectId(bookId)
    if(!checkObjectId) return res.status(400).send({status:false, message: "Please enter a valid bookId"})

    //finding book by bookId
    let books= await BooksModel.findOne({_id:bookId, isDeleted:false}).select({ISBN:0, __v:0})
    if(!books) return res.status(404).send({status:false, message:"No such book exists"})

    //finding reviews for the same book
    let reviews= await ReviewModel.find({isDeleted:false, bookId:bookId}).select({_id:1, bookId:1,reviewedBy:1,reviewedAt:1,rating:1,review:1})
    
    //declaring new variable booksData to send a desired response
    let booksData= JSON.parse(JSON.stringify(books));
    booksData.reviewsData=reviews 

    return res.status(200).send({status:true, message:'Books List', data: booksData})

}catch(error){
    return res.status(500).send({status:false, Error: error.message})
}
}

const updateBooksByBookId= async function(req,res)
{
try{
    let bookId=req.params.bookId;

    //checks for valid bookId format
    let checkObjectId = isValidObjectId(bookId)
    if(!checkObjectId) return res.status(400).send({status:false, message: "Please enter a valid bookId"})

    //if no updations data is provided
    let details= req.body;
    if(Object.keys(details).length==0) return res.status(400).send({status:true, message:'Please enter book details to update'}) 
    
    
    let keys = Object.keys(details);
    if(keys.includes("subcategory")) {
        
        let subcategory=details.subcategory;
        delete details.subcategory;  
        let keys1=Object.keys(details);
        for(let i=0; i<keys1.length; i++){
            if(!(details[keys1[i]])) return res.status(400).send({status:false, message:`Please provide proper ${keys1[i]} to update`})
            details[keys1[i]]=details[keys1[i]].trim();
            if(!(details[keys1[i]])) return res.status(400).send({status:false, message:`Please provide proper ${keys1[i]} to update`})
        }
        details.subcategory=subcategory;
    }else{
        for(let i=0; i<keys.length; i++){
            if(!(details[keys[i]])) return res.status(400).send({status:false, message:`Please provide proper ${keys[i]} to update`})
            details[keys[i]]=details[keys[i]].trim();
            if(!(details[keys[i]])) return res.status(400).send({status:false, message:`Please provide proper ${keys[i]} to update`})

        }

    }

    if(keys.includes("userId")){
        let userId = details.userId
        let checkObjectId = isValidObjectId(userId)
        if(!checkObjectId) return res.status(400).send({status:false, message: "Please enter a valid userId"})
        let user = await UserModel.findOne({_id:userId});
        if(!user) return res.status(404).send({status: false, message: "user does not exist in our database."})
    }
    //user cannot delete a book while updating it
    if(details.isDeleted==true)  return res.status(400).send({status:false, message:'You cannot delete book while updating'})
    
    //checking duplicity of title
    let title=details.title
    if(title!=undefined){
        let duplicateTitle= await BooksModel.findOne({title});
        if(duplicateTitle) return res.status(400).send({status:false, message:'title already exists'})
    }   
    
    //checking duplicity of ISBN
    let ISBN=details.ISBN
    if(ISBN!=undefined){
        let duplicateISBN= await BooksModel.findOne({ISBN});
        if(duplicateISBN) return res.status(400).send({status:false, message:'ISBN already exists'})
    }

    let book= await BooksModel.findOne({_id:bookId, isDeleted:false})
        if(!book) return res.status(404).send({status:false, message:"No such book exists"})

    keys=Object.keys(details)
    if(keys.includes("subcategory")){
        let array=details.subcategory.split(",");
        delete details.subcategory;
        let prevSubcategory=book.subcategory;
        let arr=[];
        for(let i=0;i<array.length;i++)
        {
            if(!(prevSubcategory.includes(array[i].trim()))){
            arr.push(array[i].trim())
            }
        }
        
        let newArray=prevSubcategory.concat(arr)
        

        if(Object.keys(details).length!=0)
        {
            let updationDetails2= await BooksModel.findOneAndUpdate({_id:bookId, isDeleted:false},{subcategory:newArray},{new:true})
            if(!updationDetails2) return res.status(404).send({status:false,message:"Book not found"})
            let updationDetails3= await BooksModel.findOneAndUpdate({_id:bookId, isDeleted:false},details,{new:true})
            return res.status(200).send({status:true, message:'Success', data:updationDetails3})
        }else{
            let updationDetails1= await BooksModel.findOneAndUpdate({_id:bookId, isDeleted:false},{subcategory:newArray},{new:true})
            if(!updationDetails1) return res.status(404).send({status:false,message:"Book not found"})
            return res.status(200).send({status:true, message:'Success', data:updationDetails1})
            }
    }
    //updating book after all validations
    let updationDetails= await BooksModel.findOneAndUpdate({_id:bookId, isDeleted:false},details,{new:true})
    if(!updationDetails) return res.status(404).send({status:false, message:"No such book exists"})

    return res.status(200).send({status:true, message:'Success', data:updationDetails})

}catch(error){
    return res.status(500).send({status:false, Error: error.message})
}
}


const deleteBooksByBookId= async function(req,res)
{
    try{
    
    let bookId=req.params.bookId;
    
    //checks for valid bookId format
    let checkObjectId = isValidObjectId(bookId)
    if(!checkObjectId) return res.status(400).send({status:false, message: "Please enter a valid bookId"})

    //deleting the book if it exists in our db and is not already deleted
    let deleteBook= await BooksModel.findOneAndUpdate(
        {_id:bookId, isDeleted:false}, {isDeleted:true, deletedAt:Date.now()}, {new:true})
    if(!deleteBook) return res.status(404).send({status:false, message:'No such book exists or might be already deleted'})
    
    let deleteReview= await ReviewModel.updateMany(
        {bookId:bookId, isDeleted:false}, {isDeleted:true},{new:true})
    return res.status(200).send({status:false, message:'Book and Reviews are Deleted'})

}catch(error){
    return res.status(500).send({status:false, Error: error.message})
}
}

module.exports.createBooks=createBooks;
module.exports.getBooks=getBooks;
module.exports.getBooksByBookId=getBooksByBookId;
module.exports.updateBooksByBookId=updateBooksByBookId;
module.exports.deleteBooksByBookId=deleteBooksByBookId;