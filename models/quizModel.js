const mongoose = require('mongoose');

const schema = {
    title: { type: String, required: true },
    question: { type: String, required: true },  // unique: true
    option1: { type: String, required: true },
    option2: { type: String, required: true },
    option3: { type: String, required: true },
    option4: { type: String, required: true },
    timer: { type: String },
    answer: { type: String, required: true },
}

const quizSchema = new mongoose.Schema(schema);
const User = mongoose.model('Quiz', quizSchema);

module.exports = User;