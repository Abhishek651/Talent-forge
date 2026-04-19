const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

const cookieParser = require('cookie-parser')
app.use(cookieParser())

// Middleware to parse JSON bodies
app.use(express.json())

//require auth related routes
const authRouter = require('./routes/auth.routes')
app.use('/api/auth', authRouter)

const interviewRouter = require('./routes/interview.routes')
app.use('/api/interview', interviewRouter)




//start server from another file
module.exports = app