import express from 'express'
import { createUser, loginUser, verifyEmail } from '../controllers/userController.js'

const router = express.Router()

router.post('/signup', createUser)
router.post('/signin', loginUser)
router.post('/verify-email', verifyEmail)

export default router