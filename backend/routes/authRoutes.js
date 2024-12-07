const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Helper function to normalize email
const normalizeEmail = (email) => email.toLowerCase().trim();

// Helper function to validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Register route
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields (name, email, password) are required." });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: "Invalid email format." });
        }

        // Normalize email
        const normalizedEmail = normalizeEmail(email);

        // Check if the email is already registered
        const existingUser = await User.findOne({ where: { email: normalizedEmail } });
        if (existingUser) {
            return res.status(409).json({ error: "Email is already registered." });
        }

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully.",
            user: { id: user.id, name: user.name, email: user.email }, // Do not send the hashed password
        });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ error: "An error occurred during registration. Please try again later." });
    }
});

// Login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: "Invalid email format." });
        }

        // Normalize email
        const normalizedEmail = normalizeEmail(email);

        // Find user by email
        const user = await User.findOne({ where: { email: normalizedEmail } });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Check if the password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h", // Token expires in 1 hour
        });

        res.status(200).json({
            message: "Login successful.",
            token,
            user: { id: user.id, name: user.name, email: user.email }, // Return user details for frontend usage
        });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "An error occurred during login. Please try again later." });
    }
});

// Set this at the end
module.exports = router;
