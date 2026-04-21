require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const linkRoutes = require("./routes/linkRoutes");
const { connectRedis } = require("./config/redis");
const redirectRoutes = require("./routes/redirectRoutes");

const app = express();

connectDB();
connectRedis();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/", redirectRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`),
);

module.exports = app;
