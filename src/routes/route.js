const obj = require('./logger')
const express = require('express');
const router = express.Router();

router.get('/test-me', function (req, res) {
    obj.printMessage("Trying my luck!");
    console.log(obj.url);
    res.send('My first ever api!')
});

module.exports = router;