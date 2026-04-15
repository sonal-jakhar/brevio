const crypto = require("crypto");

const generateSlug = () => {
  return crypto.randomBytes(3).toString("hex").slice(0, 5);
};

module.exports = generateSlug;
