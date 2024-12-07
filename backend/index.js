const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");

// Initialize Express app
const app = express();

// Load environment variables
dotenv.config();



// testing part
app.get("/api/test", (req, res) => {
    res.status(200).json({ message: "Test route is working!" });
});


// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Test Database Connection and Sync
sequelize.authenticate()
    .then(() => {
        console.log("✅ Database connected successfully");
        // Sync database models
        return sequelize.sync({ force: false }); // Set `force: true` for development reset
    })
    .then(() => {
        console.log("✅ Database synced and ready.");
    })
    .catch((err) => {
        console.error("❌ Database connection error:", err.message);
    });

// Test Route (for debugging)
app.get("/api/test", (req, res) => {
    res.status(200).json({ message: "Test route is working!" });
});

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/documents", documentRoutes); // Document management routes

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the Open E-Signature Service!");
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("❌ Error caught by middleware:", err.message);
    res.status(err.status || 500).json({
        error: err.message || "An unexpected error occurred",
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0"; // Allow connections from all network interfaces
app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
