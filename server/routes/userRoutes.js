import express from 'express'
import { createUser, loginUser, verifyEmail, logoutUser, deleteUser, resendEmail } from '../controllers/userController.js'

const router = express.Router()

router.post('/signup', createUser)
router.post('/signin', loginUser)
router.post('/verify-email/:id', verifyEmail)
router.post('/signout', logoutUser)
router.delete('/deleteUser', deleteUser)
router.post('/resendEmail', resendEmail)

export default router