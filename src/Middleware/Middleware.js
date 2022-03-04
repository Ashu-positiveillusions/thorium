const { nextTick} = require("process");


const firstMiddleware= async function(req,res,now){
    console.log("I am the sole middleware for a route API.")

now();
}

module.exports.firstMiddleware = firstMiddleware;