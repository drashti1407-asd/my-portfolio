
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("My Portfolio Backend is Running!");
});

// CONTACT FORM API
app.post("/api/contact", (req, res) => {

    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Please fill in all fields."
        });
    }

    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof message !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid input."
        });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    if (
        cleanName.length > 100 ||
        cleanEmail.length > 150 ||
        cleanMessage.length > 5000 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
        return res.status(400).json({
            success: false,
            message: "Please enter valid details."
        });
    }

    // Save message in MySQL
    const sql = `
        INSERT INTO contact_messages (name, email, message)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [cleanName, cleanEmail, cleanMessage],
        (err, result) => {

            if (err) {
                console.error("Database error:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Unable to save your message."
                });
            }

            res.status(201).json({
                success: true,
                message: "Your message has been sent successfully!"
            });
        }
    );
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
