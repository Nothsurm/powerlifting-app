import express from 'express'
import { newWorkout } from '../controllers/workoutController.js'

const router = express.Router()

router.post('/newWorkout', newWorkout)

export default router