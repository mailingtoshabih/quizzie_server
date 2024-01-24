const mongoose = require('mongoose');

const schema = {
    title: { type: String, required: true },
    type: { type: Boolean, required: true },
    quiz: { type: Array, required: true },
    createdAt: { type: Number, required: true },
    impression: { type: Number },
    link: { type: String, required: true },
}

const quizSchema = new mongoose.Schema(schema);
const User = mongoose.model('Quiz', quizSchema);

module.exports = User;