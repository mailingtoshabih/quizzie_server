const mongoose = require('mongoose');

const schema = {
    username: { type: String, required: true },
    email: { type: String, required: true },  // unique: true
    password: { type: String, required: true },
    // quizPublished: [{ "quizTitle": { type: String } }],
}

const userSchema = new mongoose.Schema(schema);
const User = mongoose.model('User', userSchema);

module.exports = User;