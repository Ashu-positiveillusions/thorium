const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();
const moment = require('moment')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req,res,next) => {
    console.log("Welcome to Middleware, this is global middleware and will run when any API is called.")
    // console.log("IP Address is :" ,req.socket.localAddress)
    let date = Date.now();
    // console.log("Current date and time is:", moment(date).format("DD/MM/YYYY, h:mm:ss a"))
    // console.log("Requested Path is :" ,req.path)
    console.log(moment(date).format("DD/MM/YYYY h:mm:ss a"), req.socket.localAddress, req.path )
    next();
})

mongoose.connect("mongodb+srv://functionup-cohort:G0Loxqc9wFEGyEeJ@cluster0.rzotr.mongodb.net/Pritesh8769811-DB?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
