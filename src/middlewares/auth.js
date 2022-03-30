const jwt = require("jsonwebtoken");
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

const authenticationUser=function(req,res,next)
{
try {
    let token = req.headers["x-api-key"];
    if (!token) return res.status(400).send({ status: false, message: "token must be present" });
    //verifying token with secret key
    let decodedToken = jwt.verify(token, "book-management-project");
    
    if (!decodedToken)
        return res.status(401).send({ status: false, message: "token is invalid" });//validating token value inside decodedToken
    //req.authorId = decodedToken.userId;
    next();
}
catch(error)
{
res.status(500).send({message:"Error", Error:error.message})
}
}

const authorisationUser=function(req,res,next)
{
try {
    let token = req.headers["x-api-key"];

    let decodedToken = jwt.verify(token, "book-management-project");

    let authorisedUser=decodedToken.userId;
    let logedInUser=req.query.userId;
    let userCheck=isValidObjectId(logedInUser)
    if(!userCheck) return res.status(400).send({status:false,message:"Not a valid userId"})

    if(authorisedUser!=logedInUser) return res.status(401).send({status:false,message:"You are not an authorized person to make these changes"})
    next();  
}
catch(error)
{
return res.status(500).send({message:"Error", Error:error.message})
}
}
module.exports.authenticationUser = authenticationUser;

module.exports.authorisationUser = authorisationUser;