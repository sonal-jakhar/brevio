const Click = require("../models/Click");
const Link = require("../models/Link");
const { getGeoData } = require("./getGeoData");

const trackClick = (req, link) => {
  setImmediate(async () => {
    try {
      const geoData = getGeoData(req);

      await Click.create({
        link: link._id,
        shortCode: link.shortCode,
        ...geoData,
      });

      await Link.findByIdAndUpdate(link._id, {
        $inc: { clicks: 1 },
      });
    } catch (err) {
      console.error("Click tracking failed silently:", err.message);
    }
  });
};

module.exports = { trackClick };
