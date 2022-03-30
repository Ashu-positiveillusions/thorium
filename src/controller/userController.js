const UserModel=require("../models/userModel")
const validator=require('email-validator')
const jwt=require('jsonwebtoken')


const registerUser= async function(req,res){

try{
    const userInfo=req.body;
    
    // checking if valid user info given
    if(Object.keys(userInfo).length==0) return res.status(400).send({status:false, message:"Please provide User's Info"})

    // validation of title
    let title=userInfo.title;
    if(!title) return res.status(400).send({status:false, message:"Please provide a title"})

    userInfo.title = userInfo.title.trim();
    title=title.trim();

    if(!title) return res.status(400).send({status:false, message:"Please provide a title"})
    if(!(title=="Mr" || title=="Miss" || title=="Mrs") ) return res.status(400).send({status:false, message:"Please provide a valid title from [Mr, Mrs, Miss]"})
    
    // validation of name
    let name=userInfo.name;
    if(!name) return res.status(400).send({status:false, message:"Please provide your name"})

    userInfo.name = userInfo.name.trim();
    name=name.trim();

    if(!name) return res.status(400).send({status:false, message:"Please provide your name"})

    // validation of email
    let email = userInfo.email;
    if(!email) return res.status(400).send({status:false, message:"Please provide your Email Id"})

    userInfo.email = userInfo.email.trim();
    email=email.trim();

    if(!email) return res.status(400).send({status:false, message:"Please provide your Email Id"})
    if(validator.validate(email)== false)return res.status(400).send({status:false, msg: "Please input a valid email"})
    
    let duplicateEmail = await UserModel.findOne({ email:email });
    if (duplicateEmail) return res.status(400).send({ status: false, message: "Email Id is already in use" });

    // validation of phone Number
    let mobile = userInfo.phone;
    if (!mobile) return res.status(400).send({ status: false, message: "Please Enter Mobile Number" });

    userInfo.phone = userInfo.phone.trim();
    mobile=mobile.trim();

    if (!mobile) return res.status(400).send({ status: false, message: "Please Enter Mobile Number" });
        function checkIndianNumber(b){  
            var a = /^[6-9]\d{9}$/gi;  
                if (a.test(b))   
                {  
                    return true;  
                }   
                else   
                {  
                    return false; 
                }  
        };
    let mobileCheck = checkIndianNumber(mobile);
    if(mobileCheck==false) return res.status(400).send({status:false, message:"Please enter a valid mobile number"})

    let duplicateNumber = await UserModel.findOne({phone:mobile });
    if (duplicateNumber)    return res.status(400).send({ status: false, message: "Mobile Number is already in use" });
    
    // password validation
    let password=userInfo.password;
    if(!password)  return res.status(400).send({ status: false, message: "Please provide a password" });

    if(! (password.length>=8 && password.length<=15 ))  return res.status(400).send({ status: false, message: "Enter a valid password in range of 8 to 15" });
    
    const data=await UserModel.create(userInfo);
    return res.status(201).send({status:true, message:'Success',data:data})

}catch(error){
    return res.status(500).send({status:false, Error: error.message})
}
}

const loginUser=async function(req,res){
try{
    let email=req.body.email;
    let pswd=req.body.password;

    //checking if email and password are there..
    if(!email) return res.status(400).send({status:false, message: "Please input a email"})
    if(!pswd) return res.status(400).send({status:false, message: "Please input password"})

    email=email.trim();
    if(!email) return res.status(400).send({status:false, message: "Please input a email"})

    // checking if a user exist with these credentials
    let loggedUser= await UserModel.findOne({email:email,password:pswd})
    if(!loggedUser)return res.status(404).send({status:false, message: "No such user exists"})

    // generating a token
    let token = jwt.sign(
    {
    userId: loggedUser._id,
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