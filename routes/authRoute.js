const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');



const generateToken = (userId) => {
    return jwt.sign({ userId }, 'your-secret-key', { expiresIn: '1y' });
};

// Add a new user
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the email is already registered
        // const existingUser = await User.findOne({ email });
        // if (existingUser) {
        //     return res.status(400).json({ error: 'Email is already registered' });
        // }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = User({ username, email, password: hashedPassword });
        await newUser.save();

        // -------------
        const token = generateToken(newUser._id);
        res.json({ user: newUser, token });

    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = generateToken(user._id);
        res.json({ user, token });
    } catch (error) {
        res.status(500).send(error.message);
    }
});



// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/verify-token', authMiddleware, (req, res) => {
    res.json({ message: 'Token is valid' });
});


module.exports = router;