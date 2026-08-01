const Link = require("../models/Link");
const { redisClient } = require("../config/redis");
const { trackClick } = require("../utils/trackClick");

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
      try {
        const parsed = JSON.parse(cachedUrl);
        trackClick(req, {
          _id: parsed.linkId,
          shortCode: parsed.shortCode,
        });
        return res.redirect(parsed.originalUrl);
      } catch {
        // malformed cache entry — fall through to MongoDB
        await redisClient.del(shortCode);
      }
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
      await redisClient.setEx(
        shortCode,
        3600,
        JSON.stringify({
          originalUrl: link.originalUrl,
          linkId: link._id,
          shortCode: link.shortCode,
        }),
      );
    } catch (redisErr) {
      console.error("Redis write failed:", redisErr);
    }

    //Step 4 - fire-and-forget full click tracking
    trackClick(req, link);

    return res.redirect(link.originalUrl);
  } catch (err) {
    next(err);
  }
};

module.exports = { redirectToOriginal };
