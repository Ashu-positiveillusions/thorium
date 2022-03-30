const express = require('express');
const router = express.Router();
const UserController=require("../controller/userController")
const BookController=require("../controller/bookController")
const ReviewController=require("../controller/reviewController")
const Middleware=require("../middlewares/auth")

// user Routes
router.post("/register", UserController.registerUser)
router.post("/login",UserController.loginUser)


// books routes
router.post("/books",Middleware.authenticate, Middleware.authorize, BookController.createBooks)
router.get("/books",Middleware.authenticate, BookController.getBooks)
router.get("/books/:bookId",Middleware.authenticate, BookController.getBooksByBookId)
router.put("/books/:bookId",Middleware.authenticate, Middleware.authorize, BookController.updateBooksByBookId)
router.delete("/books/:bookId",Middleware.authenticate, Middleware.authorize, BookController.deleteBooksByBookId)

// review routes
router.post("/books/:bookId/review", ReviewController.addReview)
router.put("/books/:bookId/review/:reviewId", ReviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId", ReviewController.deleteReview)


module.exports = router;