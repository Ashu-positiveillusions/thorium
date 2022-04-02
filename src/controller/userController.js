const UserModel=require("../models/userModel")
const validator1=require('email-validator')
const jwt=require('jsonwebtoken')
const validator=require("../validator/validator")


const registerUser= async function(req,res){

try{
    const userInfo=req.body;
    
    // checking if valid user info given
    if(!(validator.isValid(userInfo))) return res.status(400).send({status:false, message:"Please provide User's Info"}) 
    
    // validation of title
    if(!(validator.isValid(userInfo.title))) return res.status(400).send({status:false, message:"Please provide a title"}) 
    userInfo.title = userInfo.title.trim();
    if(!(userInfo.title=="Mr" || userInfo.title=="Miss" || userInfo.title=="Mrs") ) return res.status(400).send({status:false, message:"Please provide a valid title from [Mr, Mrs, Miss]"})
    
    // validation of name
    if(!(validator.isValid(userInfo.name))) return res.status(400).send({status:false, message:"Please provide your name"})
    userInfo.name = userInfo.name.trim();

    // validation of email
    if(!(validator.isValid(userInfo.email))) return res.status(400).send({status:false, message:"Please provide your Email Id"})
    userInfo.email = userInfo.email.trim();
    if(validator1.validate(userInfo.email)== false)return res.status(400).send({status:false, msg: "Please input a valid email"})
        
    // validation of phone Number
    if (!(validator.isValid(userInfo.phone))) return res.status(400).send({ status: false, message: "Please Enter Mobile Number" });
    userInfo.phone = userInfo.phone.trim();
    let mobileCheck=validator.checkIndianNumber(userInfo.phone)
    if(!mobileCheck) return res.status(400).send({status:false, message:"Please enter a valid Phone"})

    //duplicacy check
    let duplicate = await UserModel.find({$or:[ {email:userInfo.email},{phone:userInfo.phone}]});
    if(duplicate.length!=0){
        for(let i=0;i<duplicate.length;i++){
            if(duplicate[i].email==userInfo.email) return res.status(400).send({ status: false, message: "Email Id is already in use" });
            if(duplicate[i].phone==userInfo.phone) return res.status(400).send({ status: false, message: "Phone number is already in use" });
        }
}
    // password validation
    if(!(validator.isValid(userInfo.password)))  return res.status(400).send({ status: false, message: "Please provide a password" });
    if(! ((userInfo.password).length>=8 && (userInfo.password).length<=15 ))  return res.status(400).send({ status: false, message: "Enter a valid password in range of 8 to 15" });
    
    //address validation
    let address=userInfo.address
    if(typeof(address)!="object"){
        return res.status(400).send({status:false, message:"Address should be in Object format"})
    }
    
    const data=await UserModel.create(userInfo);
    return res.status(201).send({status:true, message:'Success',data:data})

}catch(error){
    return res.status(500).send({status:false, Error: error.message})
}
}


const loginUser=async function(req,res){
try{
    let { email, password } = req.body;

    //checking if email and password are there..
    if(!email) return res.status(400).send({status:false, message: "Please input a email"})
    if(!password) return res.status(400).send({status:false, message: "Please input password"})

    email=email.trim();
    if(!email) return res.status(400).send({status:false, message: "Please input a email"})

    // checking if a user exist with these credentials
    let loggedUser= await UserModel.findOne({email:email,password:password})
    if(!loggedUser)return res.status(404).send({status:false, message: "No such user exists"})

    // generating a token
    let token = jwt.sign(
    {
    userId: loggedUser._id,
    iat:Math.floor(Date.now()/1000)+(60*60)
    },
    "book-management-project",{expiresIn:"0.5h"});
    
    // setting a response header
    res.setHeader("x-api-key", token);

    return res.status(201).send({status: true,message:'Success', data: token});
    
}catch(error){
    return res.status(500).send({status:false, Error: error.message})
}
}
    

module.exports.registerUser=registerUser;
module.exports.loginUser=loginUser;