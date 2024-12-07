const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files to the "uploads" directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage });

// Upload document route
router.post("/upload", upload.single("document"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        res.status(200).json({
            message: "File uploaded successfully.",
            file: {
                originalName: req.file.originalname,
                filePath: req.file.path,
                mimeType: req.file.mimetype,
            },
        });
    } catch (err) {
        console.error("Error uploading file:", err);
        res.status(500).json({ error: "An error occurred during file upload." });
    }
});

module.exports = router;
