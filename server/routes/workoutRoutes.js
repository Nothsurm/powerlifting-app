import express from 'express'
import { newWorkout, editWorkout } from '../controllers/workoutController.js'

const router = express.Router()

router.post('/newWorkout', newWorkout)
router.post('/editWorkout/:postId', editWorkout)

export default router