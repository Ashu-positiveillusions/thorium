const express = require('express');
const router = express.Router();

const userController= require("../controllers/userController")
const productController= require("../controllers/productController")
const orderController = require("../controllers/orderController")



router.post("/createUser",userController.checkUser, userController.createUser)
router.post("/createProduct", productController.createProduct)
router.post("/createOrder", orderController.checkOrder, orderController.createOrder)



module.exports = router;