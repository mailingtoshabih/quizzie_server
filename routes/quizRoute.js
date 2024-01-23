const express = require('express');
const Quiz = require('../models/quizModel');
const router = express.Router();


router.post('/publishquiz', async (req, res) => {
    try {
        const { title,
            question,
            option1,
            option2,
            option3,
            option4,
            timer,
            answer } = req.body;
        const newQuiz = Quiz({
            title,
            question,
            option1,
            option2,
            option3,
            option4,
            timer,
            answer
        });

        await newQuiz.save();
        res.json({ message: 'Quiz published successfully' });
    } catch (error) {
        res.status(500).send(error.message);
    }
})








router.post('/updatequiz', (req, res) => {
})

router.get('/getquiz', (req, res) => {
})


module.exports = router;