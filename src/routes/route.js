const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const authChecker = require("../middleware/auth")



router.post("/user", userController.createUser)

router.post("/login", userController.loginUser)

router.get("/users/:userId",authChecker.authCheck, userController.getUserData)

router.put("/users/:userId",authChecker.authCheck, userController.updateUser)

router.delete("/users/:userId",authChecker.authCheck, userController.deleteUser)

module.exports = router;