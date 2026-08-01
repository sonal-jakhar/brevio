const express = require("express");
const router = express.Router();
const {
  createLink,
  getUserLinks,
  getLinkAnalytics,
} = require("../controllers/linkController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", createLink);
router.get("/", getUserLinks);
router.get("/:id/analytics", getLinkAnalytics);

module.exports = router;
