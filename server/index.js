import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/connectDB.js'

import userRoutes from './routes/userRoutes.js'
import workoutRoutes from './routes/workoutRoutes.js'

// CONFIGURATION
dotenv.config();
connectDB()   
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

// PORT
const PORT = process.env.PORT_NUMBER || 5000
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

// ROUTES
app.use('/api/users', userRoutes)
app.use('/api/workouts', workoutRoutes)

// LAYOUT OF ERROR
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})