const express = require('express');
const router = express.Router();
const CowinController= require("../controllers/cowinController")
const Weather = require("../controllers/weatherController")
const MemesController = require("../controllers/memesController")




router.get("/cowin/states", CowinController.getStates)
router.get("/cowin/districtsInState/:stateId", CowinController.getDistricts)
router.get("/cowin/getByPin", CowinController.getByPin)
router.get("/cowin/getSessionInDistricts", CowinController.getSessionInDistricts)

router.post("/cowin/getOtp", CowinController.getOtp)
router.post("/memes", MemesController.memes)

router.get("/getweather", Weather.getWeather)


module.exports = router;