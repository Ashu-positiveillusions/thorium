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

const isValid=function(valid){
    if(valid==null){
        // console.log("0")
         return false }       //because findOne etc. returns null if no object found
    if(typeof(valid)=="string"){          //checking if valid is empty space or empty string
        //console.log(typeof(valid))
        //console.log("1")
        if(!valid) return false
        if(!valid.trim()) return false
    }
    if(Array.isArray(valid)){
        //console.log("2")
        if(valid.length==0) return false
    }
    if(Object.keys(valid).length==0){
        // console.log("3")
         return false //checking if an object has any keys
    }
    // console.log("4")
    // console.log(typeof(valid))
    return true
}

const checkIndianNumber= function(b){  
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


module.exports.isValidObjectId=isValidObjectId;
module.exports.isValid=isValid;
module.exports.checkIndianNumber=checkIndianNumber;