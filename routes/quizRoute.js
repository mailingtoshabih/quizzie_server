const express = require('express');
const Quiz = require('../models/quizModel');
const authMiddleware = require('../middleware/authMiddleware'); // Use the middleware
const e = require('express');

const router = express.Router();


// Called by Pollpage.jsx
router.post('/publishquiz', async (req, res) => {
    try {
        const { title, type, userId } = req.body.initialForm;
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
            impression: 0,
            createdBy: userId,
            createdAt: new Date(),
        })

        const savedQuiz = await newQuiz.save();

        // Update the link property with the saved quiz ID
        savedQuiz.link = `http://localhost:5173/quiz/attempquiz/${savedQuiz._id}`;
        await savedQuiz.save();
        res.send(true);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
})


// Called by Quiz.jsx
router.get("/attempquiz/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Find the quiz in the database based on the provided quizLink
        const quiz = await Quiz.findOne({ _id: id });
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        quiz.impression += 1;
        await quiz.save();
        // For simplicity, let's assume the answers are an array of user's choices
        // You would need to implement your own logic based on the quiz structure
        res.send(quiz);
    } catch (error) {
        res.status(500).send(error.message);
    }
})


// Called by Question.jsx
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


// called by congrats.jsx
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


// Called by analytics.jsx
router.get('/getallquiz/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userQuizzes = await Quiz.find({ createdBy: id });
        res.json(userQuizzes);
    }
    catch (e) {
        console.log(e.message);
    }
})


// Called by Tablerow.jsx
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


router.get("/trending/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const trendingUserQuizzes = await Quiz.find({ createdBy: userId, impression: { $gt: 10 } })
        res.send(trendingUserQuizzes);
    } catch (error) {
        res.status(500).send(error.message);
    }
});




// Route to save answers and update the previous quiz
router.post('/saveanswer', async (req, res) => {
    try {
        const { quizid, question, answers } = req.body;
        // res.send({quizid,question,answers})

        const updatedQuiz = await Quiz.findOneAndUpdate(
            { _id: quizid, 'quiz.question': question },
            { $push: { 'quiz.$.userAnswers': answers } },
            { new: true } 
        );

        if (!updatedQuiz) {
            return res.status(404).json({ error: 'Question or Quiz not found' });
        }

        const updatedQuestion = updatedQuiz.quiz.find(q => q.question === question);
        res.send(updatedQuiz);
    } catch (error) {
        // Handle errors and send an appropriate response
        res.status(500).json({ error: error.message });
    }
});




module.exports = router;
