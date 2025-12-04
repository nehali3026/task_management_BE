const { Sequelize } = require("sequelize");
const path = require("path");

// SQLite DB path (works locally + on Render)
const dbPath = path.join(__dirname, "..", "data", "database.sqlite");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: false, // Optional
});

module.exports = sequelize;
