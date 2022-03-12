let axios = require("axios")


let getWeather = async function (req, res) {

    try {
        const array = []
        let cities =["Bengaluru","Mumbai", "Delhi", "Kolkata", "Chennai", "London", "Moscow"]
        
            for(let i=0; i<cities.length; i++){
                let options = {
                    method: 'get',
                    url: `http://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&appid=088f08d101eecf972b3b263dfc8c7a7a`
                }
            let result = await axios(options);
            let data = result.data.main.temp
            let obj = { city:`${cities[i]}`, temp: data}
            array.push(obj)
            array.sort((a,b)=> a.temp-b.temp)
            }
        
        res.status(200).send({array})
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

module.exports.getWeather = getWeather;