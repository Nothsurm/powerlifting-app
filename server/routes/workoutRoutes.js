import express from 'express'
import { newWorkout, editWorkout, deleteWorkout } from '../controllers/workoutController.js'

const router = express.Router()

router.post('/newWorkout', newWorkout)
router.post('/editWorkout/:postId', editWorkout)
router.delete('/deleteWorkout/:postId', deleteWorkout)

export default router