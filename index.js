const authRoute = require('./routes/authRoute');
const quizRoute = require('./routes/quizRoute');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const mongoDBUri = process.env.MONGODB_URI;
const app = express();


mongoose.connect(`${mongoDBUri}`)
    .then(() => console.log("Server Connected..."))
    .catch((e) => console.log(e.message))


app.use(cors());
app.use(express.json());
app.use("/auth", authRoute);
app.use("/quiz", quizRoute);

app.get("/", (req, res) => {
    res.send("Health : OK")
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening at ${PORT}...`));
