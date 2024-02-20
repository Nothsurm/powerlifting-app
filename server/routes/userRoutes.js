import express from 'express'
import { createUser, loginUser, verifyEmail, logoutUser } from '../controllers/userController.js'

const router = express.Router()

router.post('/signup', createUser)
router.post('/signin', loginUser)
router.post('/verify-email', verifyEmail)
router.post('/signout', logoutUser)

export default router