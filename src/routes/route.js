const express = require('express');
const router = express.Router();



// let myArr = [23, 45, 67, 281394, 32424, 423, 24, 42323, 4, 234, 12, 34]
// //filter out all the numbers that are greater than input( input is received from query params)
// router.post("/post-query-2", function (req, res) {
//     //CODE HERE
//     let input= req.query.input
//     let finalArr= myArr.filter( ele => ele > input)
//     // let finalArr=[]
//     // for (i=0 ; i<myArr.length; i++) {
//     //     if ( myArr[i] > input )      finalArr.push(myArr[i]) 
//     // }
//     res.send({ result: finalArr , status: true })
// })


// ASSIGNMENT:
// you will be given an array of persons ( i.e an array of objects )..each person will have  a {name: String , age: Number, votingStatus: true/false(Boolean)}
// take input in query param as votingAge..and for all the people above that age, change votingStatus as true
// also return an array consisting of only the person that can vote

//  take this as sample for array of persons:
let persons= [
    {
    name: "PK",
    age: 10,
    votingStatus: false
},
{
    name: "SK",
    age: 20,
    votingStatus: false
},
{
    name: "AA",
    age: 70,
    votingStatus: false
},
{
    name: "SC",
    age: 5,
    votingStatus: false
},
{
    name: "HO",
    age: 40,
    votingStatus: false
}
]


router.get("/post-query-2", function (req, res) {
        
        let qualifyingAge= Number(req.query.votingAge);
        let newArr = [];
        for (let i=0;i<persons.length;i++){
            if(persons[i].age>qualifyingAge){
                persons[i].votingStatus = true;
            }newArr.push(persons[i]);
        }
        
        let eligiblePeople = newArr.filter(element => element.votingStatus === true);
        console.log(eligiblePeople)
        res.send(eligiblePeople);
        
})

router.get("/persons-query" , function(req, res) {
    let voteAge=req.query.votingAge
    let newArr=[]
    
for(let i=0;i<persons.length;i++)
{
    if(voteAge<persons[i].age)
    {
        persons[i].votingStatus=true
        newArr.push(persons[i])
        
    }    
}res.send(newArr);
})

module.exports = router;