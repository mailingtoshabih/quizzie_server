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
            link: "",
            impression: 100,
            createdAt: new Date(),
        })

        const savedQuiz = await newQuiz.save();

        // Update the link property with the saved quiz ID
        savedQuiz.link = `http://localhost:3000/quiz/attempquiz/${savedQuiz._id}`;
        await savedQuiz.save();
        res.send(true);
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


router.get('/getquiz/:id', async (req, res) => {
    try {
        const quizId = req.params.id;
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        res.json(quiz);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/recentquiz', async (req, res) => {
    try {
        const mostRecentQuiz = await Quiz.findOne().sort({ createdAt: -1 });
        if (!mostRecentQuiz) {
            return res.status(404).json({ error: 'No published quizzes found' });
        }
        res.json(mostRecentQuiz.link);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/getallquiz', async (req, res) => {
    try {
        const users = await Quiz.find();
        res.json(users);
    }
    catch (e) {
        console.log(e.message);
    }
})


router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Check if the quiz exists
        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Perform any additional authorization checks if needed (e.g., check if the user is allowed to delete the quiz)

        await Quiz.findByIdAndDelete(id);
        res.send(true);
    } catch (error) {
        res.status(500).send(error.message);
    }
});















router.post('/updatequiz', (req, res) => {
})
module.exports = router;