const User = require('../models/userModel');
const express = require('express');
const router = express.Router();




// Add a new user
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = User({ name, email, password });
        console.log(name, email, password)
        await newUser.save();
        res.json({ message: 'User added successfully' });
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


module.exports = router;