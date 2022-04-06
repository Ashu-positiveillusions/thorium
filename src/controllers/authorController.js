const authorModel = require("../models/authorModel");
const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
  18800,
  "redis-18800.c264.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("FGpuu4MNu9eKD5N1RwraHBXr0DG5fWU2", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


const createAuthor = async function (req, res) {
  let data = req.body;
  let authorCreated = await authorModel.create(data);
  res.send({ data: authorCreated });
};

const fetchAuthorProfile = async function (req, res) {
  let cahcedProfileData = await GET_ASYNC(`${req.params.authorId}`)
  if(cahcedProfileData) {
    res.send(cahcedProfileData)
  } else {
    let profile = await authorModel.findById(req.params.authorId);
    await SET_ASYNC(`${req.params.authorId}`, JSON.stringify(profile))
    res.send({ data: profile });
  }

};

module.exports.createAuthor = createAuthor;
module.exports.fetchAuthorProfile = fetchAuthorProfile;