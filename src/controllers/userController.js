const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const createUser = async function (req, res) {
  let data = req.body;
  let savedData = await userModel.create(data);
  res.send({ msg: savedData });
};

const loginUser = async function (req, res) {
  let userName = req.body.emailId;
  let password = req.body.password;
  let user = await userModel.findOne({ emailId: userName, password: password });
    if (!user)
      return res.send({
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
  res.send({ status: true, data: token });
};

const getUserData = async function (req, res) {

  let userId = req.params.userId;
  let userDetails = await userModel.findById(userId);
  if (!userDetails)
    return res.send({ status: false, msg: "No such user exists" });

  res.send({ status: true, data: userDetails });
};

const updateUser = async function (req, res) {
  let userId = req.params.userId;
  let user = await userModel.findById(userId);
  
  if (!user) {
    return res.send({status: false, msg: "No such user exists"});
  }
  let userData = req.body;
  let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, userData, {new:true});
  res.send({ status: true, data: updatedUser });
};

const deleteUser = async function(req,res){
  let userId = req.params.userId;
  let user = await userModel.findById(userId);

  if(!user) return res.send({status: false, msg: "No such user exists"})
  let deletedUser = await userModel.findOneAndUpdate({_id: userId}, {$set:{isDeleted:true}},{new:true})
  res.send({status:true, data: deletedUser})
}

const postMessage = async function(req,res){
  let message = req.body.message;
  let userId = req.params.userId;
  let userToBeUpdated = await userModel.findById(userId);
  userToBeUpdated.posts.push(message);
  let userAfterMessage = await userModel.findOneAndUpdate({_id:userId},{$set:{posts:userToBeUpdated.posts}},{new:true})
  res.send({status: true, msg: userAfterMessage});
}

module.exports.createUser = createUser;
module.exports.getUserData = getUserData;
module.exports.updateUser = updateUser;
module.exports.loginUser = loginUser;
module.exports.deleteUser = deleteUser;
module.exports.postMessage= postMessage;
