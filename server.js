const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const sequelize = require("./config/db");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));

// PORT for Render
const PORT = process.env.PORT || 5000;

// Start + Sync DB
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running on ${PORT} (SQLite synced).`)
    );
  })
  .catch((err) => console.error("DB sync error:", err));
