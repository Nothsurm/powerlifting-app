import express from 'express'
import { createUser, loginUser, verifyEmail, logoutUser, deleteUser, resendEmail, updateUser, google, forgotPassword, resetPassword } from '../controllers/userController.js'
import { verifyToken } from '../middleware/verifyUser.js'

const router = express.Router()

router.post('/signup', createUser)
router.post('/signin', loginUser)
router.post('/verify-email/:id', verifyEmail)
router.post('/signout', logoutUser)
router.delete('/deleteUser/:userId', verifyToken, deleteUser)
router.post('/resendEmail', resendEmail)
router.put('/update/:userId', verifyToken, updateUser)
router.post('/google', google)
router.post('/forgotPassword', forgotPassword)
router.post('/resetPassword/:token', resetPassword)

export default router