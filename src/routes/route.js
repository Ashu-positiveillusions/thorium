const express = require('express');
const router = express.Router();
// const UserModel= require("../models/userModel.js")
const UserController= require("../controllers/userController")
const BookController= require("../controllers/bookController")

router.post("/createBook", BookController.createBook  )

router.get("/booksList", BookController.booksList)

router.post("/getsBooksInYear", BookController.getBooksInYear)

router.get("/getXINRBooks", BookController.getXINRBooks)

router.get("/getRandomBooks", BookController.getRandomBooks)

router.post("/getParticularBooks", BookController.getParticularBooks)

module.exports = router;