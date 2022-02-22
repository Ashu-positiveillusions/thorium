const express = require('express');
const router = express.Router();
const moviesArray = ["Titanic", "Shawshank Redemption", "The Terminator"];
const moviesObject = [ {
    id: 1,
    name: "The Shining"
   }, {
    id: 2,
    name: "Incendies"
   }, {
    id: 3,
    name: "Rang de Basanti"
   }, {
    id: 4,
    name: "Finding Demo"
   }]
   
router.get('/movies', function(req, res) {
    res.send(moviesArray);
})
router.get('/movies/:indexNumber', function(req, res) {
    let index = req.params.indexNumber;
    if(index>moviesArray.length-1){
        res.send("Please use a valid index");
    }else{
        res.send(moviesArray[index]);
    }
})
router.get('/films', function(req, res) {
    res.send(moviesObject);
})
router.get('/films/:filmId', function(req, res) {
    let id = req.params.filmId;
    if(id>moviesObject.length||id<1){
        res.send("No movie with this Id. Please input a valid Id.")
    }else{
    res.send(moviesObject[id-1]);
    
    }
})
// router.get('/films/:filmId', function(req, res) {
//     let idd = req.params.filmId;
//     {for(let i=0;i<moviesObject.length;i++){
//         if(moviesObject[i].id==idd){
//             res.send(moviesObject[i]);
//             break;
//         }
//     }}res.send("No such ID exist");
// })
module.exports = router;
