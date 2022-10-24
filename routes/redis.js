const express = require("express");
const responseTime = require("response-time");
const axios = require("axios");
const redis = require("redis");
const router = express.Router();
require('dotenv').config();
console.log(process.env.REDIS_ENDPOINT);
const redisClient = redis.createClient({
  url: process.env.REDIS_ENDPOINT
});

(async () => {
  try {
    await redisClient.connect();
  } catch(err) {
    console.log(err);
  }
})();

router.get('/', async (req, res) => {
    const query = req.query.hash;
    
    const result = await redisClient.get(query);
    if (result) {
      res.json({hashExists: true});
    } else {
      console.log("Adding hash to redis");
      await redisClient.setEx(query, 3600, "true");
      res.json({hashExists: false});
    }
});

module.exports = router;
