const axios = require("axios")


const memes = async function (req, res) {
    try {
        let id = req.body.template_id
        let text0 = req.body.text0
        let text1 = req.body.text1
        let username = req.body.username
        let password = req.body.password

        let options = {
            method: "post",
            url: `https://api.imgflip.com/caption_image?text0=${text0}&text1=${text1}&template_id=${id}&username=${username}&password=${password}`,
            // data: data
        }
        let result = await axios(options)
        console.log(result.data)
        res.status(200).send({ msg: result.data })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

module.exports.memes = memes;
