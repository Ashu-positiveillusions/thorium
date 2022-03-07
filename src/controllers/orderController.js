const orderModel = require("../models/orderModel");
const OrderModel= require("../models/orderModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

const createOrder= async function (req, res) {
    let data= req.body
    data.date= Date.now()
    // console.log(data)
    let productId = req.body.productId;
    let userId = req.body.userId;
    let requiredUser = await userModel.findById(userId);
    let requiredProduct = await productModel.findById(productId);
    // console.log(requiredProduct, requiredUser);

    if(requiredUser===null || requiredProduct===null){
        return res.send("The product or user do not exist in our database");
    }
        let savedData= await OrderModel.create(data)
        let header1 = req.headers.isfreeappuser
        console.log(header1)
        if(header1==="true"){
            let updatedOrder = await OrderModel.findOneAndUpdate({
                _id: savedData._id},
                {$set:{amount:0, isFreeAppUser:true}},
                {new:true})
            return res.send({"updatedOrder":updatedOrder})
        }else{
            let user = await userModel.findById(userId);
            let product = await productModel.findById(productId);
            if(user.balance>=product.price){
                let updatedUser = await userModel.findOneAndUpdate({
                    _id: user._id},
                    {$inc: {balance: -product.price}},
                    {new:true}
                );
                let updatedOrderDetails = await orderModel.findOneAndUpdate({
                    _id: savedData._id},
                    {$set:{amount:product.price, isFreeAppUser:false}},
                    {new:true}
                )
                return res.send({"details": updatedOrderDetails, updatedUser})
            }else{
                return res.send("You do not have sufficient balance.")
            }
        }
    
    
}

const checkOrder = function(req,res,next){
    let header = req.headers.isfreeappuser;
    // console.log(header)
    if(header=== undefined ){
        return res.send("Request is missing a mandatory header");
    }
    next();
}
module.exports.createOrder= createOrder;
module.exports.checkOrder = checkOrder;