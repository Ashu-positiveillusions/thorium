const BooksModel=require("../models/booksModel");
//const UserModel=require("../models/userModel");
const ReviewModel=require("../models/reviewModel");
const validator=require("../validator/validator")
const moment = require('moment')

const addReview=async function(req, res)
{
    try{
    
    //checking if bookId is valid
    let bookId=req.params.bookId;
    if(!(validator.isValidObjectId(bookId))) return res.status(400).send({status:false, message: "Please enter a valid bookId in path params"})

    let review= req.body;

    //checking if user is providing review
    if(!(validator.isValid(review))) return res.status(400).send({status:false, message:'Please add review'})

    if(!(review.bookId))  return res.status(400).send({status:false, message:'Please add bookId'}) 
    if(!(validator.isValidObjectId(review.bookId))) return res.status(400).send({status:false, message: "Please enter a valid bookId in request body"})
    if(review.bookId!=bookId) return res.status(400).send({status:false, message:'Please add a review of the same bookId'}) 

    //adding mandatory reviewedAt field to review 
    if(!(review.reviewedAt)){
        review.reviewedAt = Date.now();//if user not providing reviewedAt field then adding current date to it
    }else if(!(review.reviewedAt.trim())){
        review.reviewedAt = Date.now();
    }else{
        let validity = moment(review.reviewedAt, "YYYY-MM-DD",true).isValid();//if user is not providing reviewedAt date in valid format
        if(!validity) return res.status(400).send({status:false,message:"input a valid date in YYYY-MM-DD format."})
    }
    
    let {reviewedBy, rating}= review

    //validating reviewedBy
    if(!reviewedBy){
        reviewedBy="Guest"//adding reviewedBy as 'Guest' by default
    }
    else{
        reviewedBy=reviewedBy.trim();
        if(!reviewedBy)  reviewedBy= "Guest"           
        review.reviewedBy=reviewedBy;
    }

    //validating rating range
    if(!rating) return res.status(400).send({status:false, message:'Please provide rating'})
    if(rating<1 || rating>5) return res.status(400).send({status:false, message:'rating can only be between 1 to 5'})
    
    //checking if review is providing and trimming its spaces
    if(review.review) review.review=review.review.trim();

    //checking if book exists and updating the review count
    let bookReviewCount= await BooksModel.findOneAndUpdate(
        {_id:bookId, isDeleted:false}, {$inc: { reviews: 1} }, {new:true}).select({ISBN:0, __v:0});
    if(!bookReviewCount) return res.status(404).send({status:false, message:"No such book exists"})

    //adding review
    let reviewData=await ReviewModel.create(review);

    //extracting all the total reviews available for that book
    let totalReviews= await ReviewModel.find({bookId:bookId, isDeleted:false}).select({_id:1, bookId:1,reviewedBy:1,reviewedAt:1,rating:1,review:1})
    //deep copying the bookReviewCount in booksData
    let booksData= JSON.parse(JSON.stringify(bookReviewCount));
    booksData.reviewsData=totalReviews; //adding reviewsData key in booksData   
    return res.status(201).send({status:true, message:'Books List', data: booksData}) 

}catch(error){
    return res.status(500).send({status:false, Error: error.message})
}
}

const updateReview= async function(req, res)
{
    try{
    //checking if bookId is valid
    let bookId=req.params.bookId;
    if(!(validator.isValidObjectId(bookId))) return res.status(400).send({status:false, message: "Please enter a valid bookId"})

    //checking if book exists
    let books=await BooksModel.findOne({_id:bookId, isDeleted:false}).select({ISBN:0, __v:0});
    if(!books) return res.status(404).send({status:false, message:'No such book exists'})

    //checking if reviewId is valid
    let reviewId=req.params.reviewId;
    if(!(validator.isValidObjectId(reviewId))) return res.status(400).send({status:false, message: "Please enter a valid reviewId"})

    //checking if review exists
    let review1= await ReviewModel.findOne({_id:reviewId, isDeleted:false})
    if(!review1) return res.status(404).send({status:false, message:'No such review exists'})

    //checking if review exists for the same book
    if(review1.bookId!=bookId) return res.status(400).send({status:false, message:'Please make sure that review belongs to the bookId as in params'})
    
    if(Object.keys(req.body).length==0) return res.status(400).send({status:false, message:"Please enter review to update"})
    
    if(req.body.isDeleted==true) return res.status(400).send({status:false, message:'You cannot delete a review while updating'})
    //validating rating range
    if((req.body.rating)){
    if(req.body.rating<1 || req.body.rating>5) return res.status(400).send({status:false, message:'rating can only be between 1 & 5'})
    }
    //updating review
    let reviewUpdations=await ReviewModel.findOneAndUpdate(
        {_id:reviewId, isDeleted:false},req.body,{new:true})
    
    //extracting all the total reviews available for that book
    let totalReviews= await ReviewModel.find({bookId:bookId, isDeleted:false}).select({_id:1, bookId:1,reviewedBy:1,reviewedAt:1,rating:1,review:1})
    
    //deep copying the books in booksData
    let booksData= JSON.parse(JSON.stringify(books));
    booksData.reviewsData=totalReviews;   //adding reviewsData key in booksData 
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
    if(!(validator.isValidObjectId(bookId))) return res.status(400).send({status:false, message: "Please enter a valid bookId"})

    //checking if book exists
    let books=await BooksModel.findOne({_id:bookId, isDeleted:false})
    if(!books) return res.status(404).send({status:false, message:'No such book exists'})

    //checking if reviewId is valid
    let reviewId=req.params.reviewId;
    if(!(validator.isValidObjectId(reviewId))) return res.status(400).send({status:false, message: "Please enter a valid reviewId"})

    //checking if review exists
    let review1= await ReviewModel.findOne({_id:reviewId, isDeleted:false})
    if(!review1) return res.status(404).send({status:false, message:'No such review exists'})

    //checking if review exists for the same book
    if(review1.bookId!=bookId) return res.status(400).send({status:false, message:'Please make sure that review belongs to the bookId as in params'})
    
    //deleting review
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
module.exports.deleteReview=deleteReview