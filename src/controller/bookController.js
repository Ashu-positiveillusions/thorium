const BooksModel=require("../models/booksModel");
const UserModel=require("../models/userModel");
const ReviewModel=require("../models/reviewModel");
const validator=require("../validator/validator")
const moment = require('moment')
const { get } = require("../routes/route");


const createBooks=async function(req,res){
    
try{
    let bookData=req.body;
    
    
    //checks for valid userId format    
    let checkObjectId = validator.isValidObjectId(bookData.userId)
    if(!checkObjectId) return res.status(400).send({status:false, message: "Please enter a valid userId"})
    if(bookData.userId !== req.headers["userid"]) return res.status(401).send({status: false, message: "Please create a book for the loggedIn user as you are not authorized"})

    // checking if we get any data from request body
    if(!(validator.isValid(bookData))) return res.status(400).send({status:false, message:"Please enter book details"})

    if(bookData.reviews)  return res.status(400).send({status:false, message:"Please don't provide reviews (count)"})
    // validation which are must required
    let keys = Object.keys(bookData);
    let keys1 = ["title","excerpt","userId","ISBN","category","releasedAt"]
    for(let i=0;i<keys1.length;i++){
        if(!(keys.includes(keys1[i]))){
            return res.status(400).send({status:false,message:`Please enter ${keys1[i]}`})
        }
    }
    //alternate method for validation of must required-title,excerpt,etc.
    // if(!(validator.isValid(bookData.title))) return res.status(400).send({status: false, message: "Please provide proper title to create."})
    
    //As subcategory is array of string type hence deleted subcategory from bookData as .trim() doesn't works on it 
    let subcategory=bookData.subcategory
    let reviews=bookData.reviews
    delete bookData.subcategory;
    delete bookData.reviews;

    keys=Object.keys(bookData)
    //and checks for rest data if provided or not and also removed empty spaces if there   
    for(let i=0; i<keys.length; i++){
        if(!(validator.isValid(bookData[keys[i]]))) return res.status(400).send({status: false, message: `Please provide proper ${keys[i]} to create`})
        bookData[keys[i]]=bookData[keys[i]].trim();
        }
    bookData.subcategory=subcategory;
    bookData.reviews=reviews;

    //validation of subcategory      
    if(!(validator.isValid(subcategory))) return res.status(400).send({status: false, message: "Please provide proper subcategory to create."})

    // destructuring to get all values in various variables
    let {title, ISBN, userId, releasedAt} = bookData;

    //checks for valid user
    let user= await UserModel.findById(userId)
    if(!user) return res.status(404).send({status: false, message: "User doesn't exists"})

    // duplicity check of title and ISBN
    let duplicate = await BooksModel.find({$or:[{title:title},{ISBN:ISBN}]});
    for(let i=0;i<duplicate.length;i++){
        if(duplicate[i].title==title) return res.status(400).send({status:false,message:"title already exists."})
        if(duplicate[i].ISBN==ISBN) return res.status(400).send({status:false,message:"ISBN already exists."})
    }    

    // date validation for releasedAt
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
    //checks for proper filters provided from query params
    let keys = Object.keys(filter);
    for(let i=0; i<keys.length; i++){
        if(!(validator.isValid(filter[keys[i]]))) return res.status(400).send({status:false, message:`Please provide proper ${keys[i]} filter`})
        filter[keys[i]]=filter[keys[i]].trim();
    }

    //checks if userId is provided and a valid one
    if(keys.includes("userId")){
        let userId = filter.userId
        let checkObjectId = validator.isValidObjectId(userId)
        if(!checkObjectId) return res.status(400).send({status:false, message: "Please enter a valid userId"})
    }

    //checks if subcategory is provided
    if(keys.includes("subcategory")){
        let array=filter.subcategory;
        delete filter.subcategory;
        //if other filters are provided with subcategory 
        if(Object.keys(filter).length!=0){
        let books=await BooksModel.find({$and:[{isDeleted:false}, filter,{subcategory:{$in:array}}]}).select({_id:1, title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1}).sort({title:1})
        if(books.length==0) return res.status(404).send({status:false, message: "No Book found"})  
    
        return res.status(200).send({status:true,message: 'Books list', data:books})
        }else{//if only subcategory is provided
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
    let checkObjectId = validator.isValidObjectId(bookId)
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
    if(!(validator.isValidObjectId(bookId))) return res.status(400).send({status:false, message: "Please enter a valid bookId in path params"})

    let book= await BooksModel.findOne({_id:bookId, isDeleted:false})
        if(!book) return res.status(404).send({status:false, message:"No such book exists"})
        if(req.headers["userid"]!=book.userId) return res.status(401).send({status:false, message:'You are not authorized to make changes'})

    //if no updations data is provided
    let details= req.body;
    if(!(validator.isValid(details))) return res.status(400).send({status:false, message:'Please enter book details to update'}) 
    
    //boolean of 0 is false
    if(details.reviews||details.reviews==0) return res.status(400).send({status:false, message:'You cannot update review count'}) 

    let keys = Object.keys(details);
    for(let i=0;i<keys.length;i++){
        if(!(validator.isValid(details[keys[i]])))  return res.status(400).send({status:false, message:`Please provide proper ${keys[i]} to update`})
        details[keys[i]] = details[keys[i]].trim();
    }
    
    //checks if userId is provided in updation
    if(keys.includes("userId")){
        //checks for valid userId
        if(!(validator.isValidObjectId(details.userId))) return res.status(400).send({status:false, message: "Please enter a valid userId in ObjectId format "})
        let user = await UserModel.findOne({_id:details.userId});
        if(!user) return res.status(404).send({status: false, message: "user does not exist in our database."})
    }

    //user cannot delete a book while updating it
    if(details.isDeleted==true)  return res.status(400).send({status:false, message:'You cannot delete book while updating'})
    
    //checking duplicity of title and ISBN
    let {title, ISBN } =details
    let duplicate = await BooksModel.find({$or:[{title:title},{ISBN:ISBN}]});
    for(let i=0;i<duplicate.length;i++){
        if(duplicate[i].title==title) return res.status(400).send({status:false,message:"title already exists."})
        if(duplicate[i].ISBN==ISBN) return res.status(400).send({status:false,message:"ISBN already exists."})
    }

    
    //updating subcategory in existing subcategory and removing duplication in subcategory 
    if(keys.includes("subcategory")){
        let array=details.subcategory.split(",");
        delete details.subcategory;
        let prevSubcategory=book.subcategory;
        let arr=[];
        //checking if subcategory already exists
        for(let i=0;i<array.length;i++){
            if(!(prevSubcategory.includes(array[i].trim()))){
            arr.push(array[i].trim())
            }
        }        
        let newArray=prevSubcategory.concat(arr)  
        details.subcategory=newArray
        let updationDetails= await BooksModel.findOneAndUpdate({_id:bookId, isDeleted:false},details,{new:true})
        if(!updationDetails) return res.status(404).send({status:false,message:"Book not found"})
        return res.status(200).send({status:true, message:'Success', data:updationDetails})
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
    if(!(validator.isValidObjectId(bookId))) return res.status(400).send({status:false, message: "Please enter a valid bookId"})

    let book=await BooksModel.findById(bookId);
    if(!book) return res.status(404).send({status:false, message:'No such book exists or might be already deleted'})
    if(req.headers["userid"]!=book.userId) return res.status(401).send({status:false, message:'You are not authorized to delete'})
    
    //deleting the book if it exists in our db and is not already deleted
    let deleteBook= await BooksModel.findOneAndUpdate(
        {_id:bookId, isDeleted:false}, {isDeleted:true, deletedAt:Date.now()}, {new:true})    
    
    let deleteReview= await ReviewModel.updateMany(
        {bookId:bookId, isDeleted:false}, {isDeleted:true},{new:true})
    return res.status(200).send({status:true, message:'Book and Reviews are Deleted'})

}catch(error){
    return res.status(500).send({status:false, Error: error.message})
}
}

module.exports.createBooks=createBooks;
module.exports.getBooks=getBooks;
module.exports.getBooksByBookId=getBooksByBookId;
module.exports.updateBooksByBookId=updateBooksByBookId;
module.exports.deleteBooksByBookId=deleteBooksByBookId;