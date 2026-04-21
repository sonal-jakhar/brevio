const Link = require("../models/link");
const { redisClient } = require("../config/redis");

//Redirect to original URL
//GET /:shortCode
const redirectToOriginal = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    //Step 1 - check Redis cache first
    let cachedUrl;
    try {
      cachedUrl = await redisClient.get(shortCode);
    } catch (redisErr) {
      console.error("Redis lookup failed, falling back to MongoDB:", redisErr);
    }

    if (cachedUrl) {
      Link.findOneAndUpdate({ shortCode }, { $inc: { clicks: 1 } }).exec();

      return res.redirect(cachedUrl);
    }

    //Step 2 - cache miss, query MongoDB
    const link = await Link.findOne({ shortCode });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    if (!link.isActive) {
      return res
        .status(410)
        .json({ message: "This link has been deactivated" });
    }

    //Step 3 - store in Redis with 1 hour TTL
    try {
      await redisClient.setEx(shortCode, 3600, link.originalUrl);
    } catch (redisErr) {
      console.error("Redis write failed:", redisErr);
    }

    //Step 4 - fire-and-forget click increment
    Link.findOneAndUpdate({ shortCode }, { $inc: { clicks: 1 } }).exec();

    return res.redirect(link.originalUrl);
  } catch (err) {
    next(err);
  }
};

module.exports = { redirectToOriginal };
