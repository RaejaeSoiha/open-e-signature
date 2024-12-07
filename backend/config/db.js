const { Sequelize } = require("sequelize");
const path = require("path");

// Database configuration using SQLite
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "../database/e-signature.db"), // Database file location
});

// Test database connection
sequelize.authenticate()
    .then(() => console.log("Database connected"))
    .catch((err) => console.log("Error: " + err));

module.exports = sequelize;
