const express = require('express');
const mongoose = require('mongoose')

require('dotenv').config()
require('express-async-errors');

const jobRouter = require('./routes/jobRoute');
const authRouter = require('./routes/authRoute');
const errorHandler = require('./middleware/errorHandler')
const authMiddleWare = require('./middleware/authMiddleware')

const app = express();

app.use(express.json());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authMiddleWare, jobRouter);
app.use(errorHandler)

const connectDB = async() => {
    await mongoose.connect(process.env.MONGO_URL)
}

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server listening on PORT ${PORT}`)
        })
    } catch(err) {
        console.log(err)
    }
}

start();