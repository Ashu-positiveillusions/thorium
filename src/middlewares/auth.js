const jwt = require("jsonwebtoken");

const authenticationUser=function(req,res,next)
{
try {
    let token = req.headers["x-api-key"];
    if (!token) return res.status(400).send({ status: false, message: "token must be present" });
    //verifying token with secret key
    let decodedToken = jwt.verify(token, "book-management-project");
    
    if (!decodedToken)
        return res.status(401).send({ status: false, message: "token is invalid" });//validating token value inside decodedToken
    let loggedInUser=decodedToken.userId;
    req.headers["userid"]=loggedInUser
    next();
}
catch(error)
{
res.status(500).send({message:"Error", Error:error.message})
}
}

module.exports.authenticationUser = authenticationUser;