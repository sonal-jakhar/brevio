const Link = require("../models/Link");
const Click = require("../models/Click");
const generateSlug = require("../utils/generateSlug");

//Create a short link
//POST /api/links
const createLink = async (req, res, next) => {
  try {
    const { originalUrl, customSlug } = req.body;

    if (!originalUrl) {
      res.status(400);
      throw new Error("Original URL is required");
    }

    //Handle custom slug
    if (customSlug) {
      const slugExists = await Link.findOne({ shortCode: customSlug });
      if (slugExists) {
        res.status(400);
        throw new Error("Custom slug already taken");
      }
    }

    //Generate unique shortCode with collision check
    let shortCode = customSlug || generateSlug();
    let attempts = 0;

    if (!customSlug) {
      while (await Link.findOne({ shortCode })) {
        shortCode = generateSlug();
        attempts++;
        if (attempts > 5) {
          res.status(500);
          throw new Error("Could not generate unique short code");
        }
      }
    }

    const link = await Link.create({
      user: req.user._id,
      originalUrl,
      shortCode,
      customSlug: customSlug || null,
    });

    res.status(201).json(link);
  } catch (err) {
    next(err);
  }
};

//Get all links for logged in user
//GET /api/links
const getUserLinks = async (req, res, next) => {
  try {
    const links = await Link.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(links);
  } catch (err) {
    next(err);
  }
};

const getLinkAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;

    const link = await Link.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!link) {
      res.status(404);
      throw new Error("Link not found");
    }

    const [facetResult] = await Click.aggregate([
      { $match: { link: link._id } },
      {
        $facet: {
          total: [{ $count: "count" }],

          byCountry: [
            { $group: { _id: "$country", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],

          byDevice: [
            { $group: { _id: "$device", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],

          byBrowser: [
            { $group: { _id: "$browser", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
        },
      },
    ]);

    const format = (arr) =>
      arr.map((item) => ({
        name: item._id || "Unknown",
        value: item.count,
      }));

    res.json({
      link,
      totalClicks: facetResult.total[0]?.count || 0,
      byCountry: format(facetResult.byCountry),
      byDevice: format(facetResult.byDevice),
      byBrowser: format(facetResult.byBrowser),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createLink, getUserLinks, getLinkAnalytics };
