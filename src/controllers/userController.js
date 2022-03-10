const { send } = require("express/lib/response");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const createUser = async function (req, res) {
  try{
    let data = req.body;
    if(Object.keys(data).length===0){
      return res.status(400).send({msg:"Please input some valid data to be added."})
    }
    let savedData = await userModel.create(data);
      return res.status(201).send({ msg: savedData });
  }catch(error){
    return res.status(500).send({ msg: "Error", error: error.message })
  }
  
}

const loginUser = async function (req, res) {
  try{
    let userName = req.body.emailId;
    let password = req.body.password;
    if(!userName||!password){
      res.status(400).send({msg:"Please input both userName and password."})
    }
    let user = await userModel.findOne({ emailId: userName, password: password });
      if (!user)
        return res.status(404).send({
          status: false,
          msg: "username or the password is not corerct",
        });
    let token = jwt.sign(
      {
        userId: user._id.toString()
      },
      "iamtheowner"
    );
    res.setHeader("x-auth-token", token);
    res.status(201).send({ status: true, data: token });
  }catch(error){
    return res.status(500).send({ msg: "Error", error: error.message })
  }
};

const getUserData = async function (req, res) {
  try{
  let userId = req.params.userId;
  if(!userId){
    return res.status(400).send({msg: "Please input enter userId."})
  }
  let userDetails = await userModel.findById(userId);
  if (!userDetails)
    return res.status(404).send({ status: false, msg: "No such user exists" });

  res.status(200).send({ status: true, data: userDetails });
  }catch(error){
    return res.status(500).send({ msg: "Error", error: err.message })
  }

};

const updateUser = async function (req, res) {
  try{
  let userId = req.params.userId;
  if(!userId){
    return res.status(400).send({msg:"Please enter userID."})
  }
  let user = await userModel.findById(userId);
  
  if (!user) {
    return res.status(404).send({status: false, msg: "No such user exists"});
  }
  let userData = req.body;
  let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, userData, {new:true});
  res.status(400).send({ status: true, data: updatedUser });
}catch(error)
{
  return res.status(500).send({ msg: "Error", error: err.message })
}};

const deleteUser = async function(req,res){
  try{
  let userId = req.params.userId;
  if(!userId){
    return res.status(400).send({msg:"Please enter userID."})
  }
  let user = await userModel.findById(userId);

  if(!user) return res.send(404).send({status: false, msg: "No such user exists"})
  let deletedUser = await userModel.findOneAndUpdate({_id: userId}, {$set:{isDeleted:true}},{new:true})
  res.status(201).send({status:true, data: deletedUser})
}catch(error){
  return res.status(500).send({ msg: "Error", error: err.message })
}
}

const postMessage = async function(req,res){
  try{
  let message = req.body.message;
  if(!message){
    return res.status(400).send({msg:"Please enter message."})
  }
  let userId = req.params.userId;
  if(!userId){
    return res.status(400).send({msg:"Please enter userID."})
  }
  let userToBeUpdated = await userModel.findById(userId);
  if(!userToBeUpdated){
    return res.status(404).send({msg:"No user exists."})
  }
  userToBeUpdated.posts.push(message);
  let userAfterMessage = await userModel.findOneAndUpdate({_id:userId},{$set:{posts:userToBeUpdated.posts}},{new:true})
  res.status(201).send({status: true, msg: userAfterMessage});
  }catch(error){
    return res.status(500).send({ msg: "Error", error: err.message })
  }
}

module.exports.createUser = createUser;
module.exports.getUserData = getUserData;
module.exports.updateUser = updateUser;
module.exports.loginUser = loginUser;
module.exports.deleteUser = deleteUser;
module.exports.postMessage= postMessage;
