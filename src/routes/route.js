const welcome = require('../logger/logger');
const myDetails = require('../util/helper');
const format = require('../validator/formatter');
const lodas = require('lodash')
const express = require('express');
const router = express.Router();

router.get('/test-me', function (req, res) {
    welcome.welcoming();
    myDetails.date();
    myDetails.month();
    myDetails.batchInfo();
    console.log(format.textTrim("     Ashutosh Kumar      "));
    console.log(format.lowerCase("BuFFalo, COW, LiOn"));
    console.log(format.upperCase("Buffalo, Cow, Lion"));
    res.send('My first ever api!')
});
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const oddNum = [1,3,5,7,9,11,13,15,17,19];
const a = [1,2,3];
const b = [2,3,4];
const c = [3,4,5];
const d = [4,5,6];
const e = [5,6,7];
const givenArray = [["horror","The Shining"],["drama","Titanic"],["thriller","Shutter Island"],["fantasy","Pans Labyrinth"]];

router.get('/hello', function (req, res) {
    console.log(lodas.chunk(months,3));
    console.log(lodas.tail(oddNum));
    console.log(lodas.union(a,b,c,d,e));
    console.log(lodas.fromPairs(givenArray));
    res.send('My second type of Api!')
});
module.exports = router;