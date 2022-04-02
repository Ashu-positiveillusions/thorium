const express = require('express');
const router = express.Router();
const UserController=require("../controller/userController")
const BookController=require("../controller/bookController")
const ReviewController=require("../controller/reviewController")
const Middleware=require("../middlewares/auth")

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/register", UserController.registerUser)
router.post("/login",UserController.loginUser)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/books",Middleware.authenticationUser, BookController.createBooks)
router.get("/books",Middleware.authenticationUser, BookController.getBooks)
router.get("/books/:bookId", Middleware.authenticationUser, BookController.getBooksByBookId)
router.put("/books/:bookId",Middleware.authenticationUser,  BookController.updateBooksByBookId)
router.delete("/books/:bookId", Middleware.authenticationUser, BookController.deleteBooksByBookId)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/books/:bookId/review", ReviewController.addReview)
router.put("/books/:bookId/review/:reviewId", ReviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId", ReviewController.deleteReview)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;