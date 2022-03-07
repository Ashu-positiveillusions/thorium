const UserModel= require("../models/userModel")

const createUser= async function (req, res) {
    let data= req.body
    let savedData= await UserModel.create(data)
    // console.log(req.newAtribute)
    res.send({msg: savedData})
}

const checkUser = function(req,res,next){
    let header = req.headers.isfreeappuser;
    if(header===undefined){
        return res.send("Request is missing a mandatory header");
    }
    next();
}

// const getUsersData= async function (req, res) {
//     let allUsers= await UserModel.find()
//     console.log(req.newAtribute)
//     res.send({msg: allUsers})
// }

module.exports.createUser= createUser
module.exports.checkUser = checkUser;
// module.exports.getUsersData= getUsersData