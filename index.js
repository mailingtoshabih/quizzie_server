const authRoute = require('./routes/authRoute');
const quizRoute = require('./routes/quizRoute');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb+srv://alamshabih3:8091@cluster0.pa97m3m.mongodb.net/quiz')
    .then(() => console.log("Server Connected..."))
    .catch((e) => console.log(e.message))


app.use(cors());
app.use(express.json());
app.use("/auth", authRoute);
app.use("/quiz", quizRoute);

app.get("/", (req, res) => {
    res.send("hello")
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Listening at 3000..."));