const geoip = require("geoip-lite");
const UAParser = require("ua-parser-js");
const { OS } = require("ua-parser-js/enums");

const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.ip ||
    req.socket.remoteAddress ||
    "unknown"
  );
};

const getGeoData = (req) => {
  const ip = getClientIp(req);

  const geo = geoip.lookup(ip);

  const ua = UAParser(req.headers["user-agent"] || "");

  let device = "desktop";
  if (ua.device.type === "mobile") device = "mobile";
  else if (ua.device.type === "tablet") device = "tablet";
  else if (!ua.device.type) device = "desktop";
  else device = "unknown";

  return {
    ip,
    country: geo?.country || "unknown",
    city: geo?.city || "unknown",
    device,
    browser: ua.browser.name || "unknown",
    os: ua.os.name || "unknown",
    referrer: req.headers.referer || req.headers.referrer || "direct",
  };
};

module.exports = { getGeoData };
