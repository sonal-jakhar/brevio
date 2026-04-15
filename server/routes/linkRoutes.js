const express = require("express");
const router = express.Router();
const { createLink, getUserLinks } = require("../controllers/linkController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", createLink);
router.get("/", getUserLinks);

module.exports = router;
