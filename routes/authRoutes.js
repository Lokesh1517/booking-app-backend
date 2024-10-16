// routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Make sure to adjust the path according to your project structure
const router = express.Router();
const bcrypt = require('bcrypt');

// Registration Route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log("Asss")
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err+'Server error' });
    }
});


// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        console.log("Finding user...");
        const user = await User.findOne({ username });
        
        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare hashed password with the provided password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Send token back to the client
        res.status(200).json({ token });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
