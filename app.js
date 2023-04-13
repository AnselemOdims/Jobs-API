const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const path = require('path')

require('dotenv').config()
require('express-async-errors');

const jobRouter = require('./routes/jobRoute');
const authRouter = require('./routes/authRoute');
const errorHandler = require('./middleware/errorHandler')
const authMiddleWare = require('./middleware/authMiddleware')

const app = express();

app.use(cors())
app.use(helmet())
app.use(xss())

app.use(express.json());

app.use(express.static(path.resolve(__dirname, './client/build')))
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authMiddleWare, jobRouter);
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})
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

module.exports = {
    connectDB
}