import express from 'express'
import { createUser, loginUser, verifyEmail, logoutUser, deleteUser } from '../controllers/userController.js'

const router = express.Router()

router.post('/signup', createUser)
router.post('/signin', loginUser)
router.post('/verify-email', verifyEmail)
router.post('/signout', logoutUser)
router.delete('/deleteUser', deleteUser)

export default router