const BooksModel=require("../models/booksModel");
//const UserModel=require("../models/userModel");
const ReviewModel=require("../models/reviewModel");
const moment = require('moment')
var ObjectId = require("mongoose").Types.ObjectId;

const isValidObjectId= function (a){
    if((ObjectId.isValid(a))){ 
        
        let b =  (String)(new ObjectId(a))
        
        if(b == a){ 
            return true
        }else{
            return false;
        }
    }else{
        return false
    }
}

const addReview=async function(req, res)
{
    try{
    
    //checking if bookId is valid
    let bookId=req.params.bookId;
        let checkObjectId = isValidObjectId(bookId)
        if(!checkObjectId) return res.status(400).send({status:false, message: "Please enter a valid bookId"})


    let review= req.body;
    //checking if user is providing review
    if(Object.keys(review).length==0) return res.status(400).send({status:true, message:'Please add review'})

    //adding mandatory reviewedAt field to review 
    if(!(review.reviewedAt)){
        review.reviewedAt = Date.now();
    }else if(!(review.reviewedAt.trim())){
        review.reviewedAt = Date.now();
    }else{
        let validity = moment(review.reviewedAt, "YYYY-MM-DD",true).isValid();
        if(!validity) return res.status(400).send({status:false,message:"input a valid date in YYYY-MM-DD format."})
    }

    //validating reviewedBy and rating
    let {reviewedBy, rating}= review
    if(!reviewedBy){
        reviewedBy="Guest"
    }
    else{
        reviewedBy=reviewedBy.trim();
        if(!reviewedBy)  reviewedBy= "Guest"           
        review.reviewedBy=reviewedBy;
    }

    if(!rating) return res.status(400).send({status:false, message:'Please provide rating'})
    if(rating<1 || rating>5) return res.status(400).send({status:false, message:'rating can only be between 1 & 5'})
    
    if(review.review) review.review=review.review.trim();
    //checking if book exists and updating the review count
    let bookReviewCount= await BooksModel.findOneAndUpdate(
        {_id:bookId, isDeleted:false}, {$inc: { reviews: 1} }, {new:true}).select({ISBN:0, __v:0});
    if(!bookReviewCount) return res.status(404).send({status:false, message:"No such book exists"})

    //adding review
    let reviewData=await ReviewModel.create(review);

    let totalReviews= await ReviewModel.find({bookId:bookId, isDeleted:false}).select({_id:1, bookId:1,reviewedBy:1,reviewedAt:1,rating:1,review:1})
    
    let booksData= JSON.parse(JSON.stringify(bookReviewCount));
    booksData.reviewsData=totalReviews;    
    return res.status(200).send({status:true, message:'Books List', data: booksData}) 

}catch(error){
    return res.status(500).send({status:false, Error: error.message})
}
}

const updateReview= async function(req, res)
{
    try{
    //checking if bookId is valid
    let bookId=req.params.bookId;
    let checkObjectId = isValidObjectId(bookId)
    if(!checkObjectId) return res.status(400).send({status:false, message: "Please enter a valid bookId"})
     //checking if book exists
    let books=await BooksModel.findOne({_id:bookId, isDeleted:false}).select({ISBN:0, __v:0});
    if(!books) return res.status(404).send({status:false, message:'No such book exists'})

    //checking if reviewId is valid
    let reviewId=req.params.reviewId;
    let checkObjectId1 = isValidObjectId(reviewId)
    if(!checkObjectId1) return res.status(400).send({status:false, message: "Please enter a valid reviewId"})

    //checking if review exists
    let review1= await ReviewModel.findOne({_id:reviewId, isDeleted:false})
    if(!review1) return res.status(404).send({status:false, message:'No such review exists'})

    //checking if review exists for the same book
    if(review1.bookId!=bookId) return res.status(400).send({status:false, message:'Please make sure that review belongs to the bookId as in params'})
    
    let review=req.body;
    if(Object.keys(review).length==0) return res.status(400).send({status:false, message:"Please enter review to update"})
    
    if((review.rating)){
    if(review.rating<1 || review.rating>5) return res.status(400).send({status:false, message:'rating can only be between 1 & 5'})
    }
    let reviewUpdations=await ReviewModel.findOneAndUpdate(
        {_id:reviewId, isDeleted:false},review,{new:true})
        
    let totalReviews= await ReviewModel.find({bookId:bookId, isDeleted:false}).select({_id:1, bookId:1,reviewedBy:1,reviewedAt:1,rating:1,review:1})
    
    let booksData= JSON.parse(JSON.stringify(books));
    booksData.reviewsData=totalReviews;    
    return res.status(200).send({status:true, message:'Books List', data: booksData}) 

}catch(error){
    return res.status(500).send({status:false, Error: error.message})
}
}

const deleteReview=async function(req,res)
{
    try{
    //checking if bookId is valid
    let bookId=req.params.bookId;
    let checkObjectId = isValidObjectId(bookId)
    if(!checkObjectId) return res.status(400).send({status:false, message: "Please enter a valid bookId"})

    //checking if book exists
    let books=await BooksModel.findOne({_id:bookId, isDeleted:false})
    if(!books) return res.status(404).send({status:false, message:'No such book exists'})

    //checking if reviewId is valid
    let reviewId=req.params.reviewId;
    let checkObjectId1 = isValidObjectId(reviewId)
    if(!checkObjectId1) return res.status(400).send({status:false, message: "Please enter a valid reviewId"})

    //checking if review exists
    let deleteReview= await ReviewModel.findOneAndUpdate(
        {_id:reviewId, isDeleted:false}, {isDeleted:true}, {new:true})
    if(!deleteReview) return res.status(404).send({status:false, message:'No such review exists or might be already deleted'})
    
    //decreasing review count for the book
    let bookReviewCount= await BooksModel.findOneAndUpdate(
        {_id:bookId, isDeleted:false}, {$inc: { reviews: -1} }, {new:true});

    return res.status(200).send({status:false, message:'Review Deleted'})

}catch(error){
    return res.status(500).send({status:false, Error: error.message})
}
}

module.exports.addReview=addReview;
module.exports.updateReview=updateReview;
module.exports.deleteReview=deleteReview;