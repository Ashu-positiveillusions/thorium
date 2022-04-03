const express = require('express');
const router = express.Router();
const UserController=require("../controller/userController")
const BookController=require("../controller/bookController")
const ReviewController=require("../controller/reviewController")
const Middleware=require("../middlewares/auth")


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const aws = require("aws-sdk")
const removeUploadedFiles = require('multer/lib/remove-uploaded-files');



aws.config.update(
    {
        accessKeyId: "AKIAY3L35MCRVFM24Q7U",
        secretAccessKeyId: "qGG1HE0qRixcW1T1Wg1bv+08tQrIkFVyDFqSft4J",
        region: "ap-south-1"
    }
)

let uploadFile = async (file) => {
    return await new Promise( function(resolve, reject) {
        //this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: "2006-03-01" }) //we will be using s3 service of aws
        // uploadFile(files[0])
        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket", // HERE
            Key: "ashutosh/" + file.originalname, // HERE "ashutosh/smiley.jpg"
            Body: file.buffer
        }

    s3.upload(uploadParams, function (err, data) {
            if (err) { 
                console.log(err);
                return reject({ "error": err }) 
            }

            console.log(data)
            console.log(" file uploaded succesfully ")
            return resolve(data.Location) // HERE
    })

    // let data= await s3.upload(uploadParams)
    // if (data) return data.Location
    // else return "there is an error"

    }
    )
}

// AWS S3 Link Work
router.post("/write-file-aws", async function (req, res) {
    try {
        let files = req.files
        // console.log(files, files[0])
        if (files && files.length > 0) {
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL = await uploadFile(files[0])
            res.status(201).send({ msg: "file uploaded succesfully", data: uploadedFileURL })
        }
        else {
            res.status(400).send({ msg: "No file found" })
        }
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }
}
)

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