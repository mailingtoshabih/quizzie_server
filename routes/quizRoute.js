const express = require('express');
const Quiz = require('../models/quizModel');
const router = express.Router();


router.post('/publishquiz', async (req, res) => {
    try {
        const { title, type } = req.body.initialForm;
        const quizdata = req.body.stateValue;

        let quizzes = [];
        for (const key in quizdata) {
            quizzes.push(quizdata[key])
        }
        const newQuiz = Quiz({
            title,
            type,
            quiz: quizzes,
            link: "somelink",
            impression: 100,
            createdAt: new Date(),
        })
        await newQuiz.save();
        // save the quiz id that is published just now
        res.json("Quiz Published");
    }
    catch (error) {
        res.status(500).send(error.message);
    }
})

router.get("/attempquiz/:id", async (req, res) => {
    try {
        const { id } = req.params; // Assuming quizLink and answers are sent in the request body

        // Find the quiz in the database based on the provided quizLink
        const quiz = await Quiz.findOne({ _id: id });
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        // Perform logic to check answers and calculate score if needed
        // For simplicity, let's assume the answers are an array of user's choices
        // You would need to implement your own logic based on the quiz structure
        res.send(quiz);
    } catch (error) {
        res.status(500).send(error.message);
    }

})



router.get('/getallquiz', async (req, res) => {
    try {
        const users = await Quiz.find();
        res.json(users);
    }
    catch (e) {
        console.log(e.message);
    }
})

router.delete("/deletequiz", async (req, res) => {

})















router.post('/updatequiz', (req, res) => {
})
module.exports = router;