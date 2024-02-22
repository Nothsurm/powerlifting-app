import User from "../models/userModel.js"
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../middleware/error.js"
import nodemailer from 'nodemailer'
import { generateOTP } from "../utils/email.js"
import VerifyToken from "../models/verifyTokenModel.js"
import { generateToken } from "../utils/createToken.js"
import { isValidObjectId } from "mongoose"

const createUser = async (req, res, next) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return next(errorHandler(400, 'Please fill in all input fields'))
    }
    if (username.length < 5) {
        return next(errorHandler(400, 'Username must be more than 5 characters'))
    }
    if (password.length < 5) {
        return next(errorHandler(400, 'Password must be more than 5 characters'))
    }
    if (!username.match(/^[a-zA-Z0-9]+$/)) {
        return next(errorHandler(400, 'Username must only contain letters, numbers and no spaces'))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })

    const OTP = generateOTP()
    const verificationToken = new VerifyToken({
        owner: newUser._id,
        token: OTP
    })

    try {
        await verificationToken.save()
        await newUser.save()

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.USERNAME_NODEMAILER,
              pass: process.env.PASS_NODEMAILER,
            }
          });
          
        let mailOptions = {
            from: process.env.USERNAME_NODEMAILER,
            to: email,
            subject: 'Verify your email account',
            text: `This is your 4 number verification code: ${OTP}`
          };
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return next(errorHandler(404, 'Error Sending Email'))
            } else {
                return res.json({ success: true, message: 'Email Sent'})
            }
        })
    } catch (error) {
        next(error)
    }
}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required'))
    }

    try {
        const validUser = await User.findOne({email})
        if (!validUser) {
            return next(errorHandler(404, 'User not found'))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) {
            return next(errorHandler(400, 'Invalid password'))
        }
        const token = generateToken(res, validUser._id)

        const { password: pass, ...rest} = validUser._doc //seperates the password from the rest of the json data

        res.status(200).cookie('access_token', token, {
            httpOnly: true
        }).json(rest)
    } catch (error) {
        next(error)
    }
}

const verifyEmail = async (req, res, next) => {
    const { otp } = req.body
    const userId = req.params.id
    if (!otp || otp.length < 4) {
        return next(errorHandler(404, 'Your code is not valid'))
    }
    if (!userId || !otp.trim()) {
        return next(errorHandler(404, 'Invalid request, missing parameters'))
    }

    if(!isValidObjectId(userId)) {
        return next(errorHandler(404, 'Invalid User'))
    }

    const user = await User.findById(userId)
    if (!user) {
        return next(errorHandler(404, 'User not found'))
    }
    if (user.verified) {
        return next(errorHandler(404, 'This User is already verified'))
    }

    const token = await VerifyToken.findOne({owner: user._id})
    if (!token) {
        return next(errorHandler(404, 'User not found'))
    }

    const isMatched = await token.compareToken(otp)
    if (!isMatched) {
        return next(errorHandler(404, 'Please provide a valid token'))
    }

    user.verified = true;
    
    try {
        await VerifyToken.findByIdAndDelete(token._id)
        await user.save()

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.USERNAME_NODEMAILER,
              pass: process.env.PASS_NODEMAILER,
            }
          });
          
        let mailOptions = {
            from: 'emailverification@email.com',
            to: user.email,
            subject: 'Email Verified Successfully',
            text: `Your email verified successfully. Thank you for registering with us!`
          };
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return next(errorHandler(404, 'Error Sending Email'))
            } else {
                return res.json({ success: true, message: 'Email Sent'})
            }
        })

        res.status(200).json({message: 'Email successfully verified'})
    } catch (error) {
        return next(errorHandler(404, 'User not found'))
    }
}

const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('User has been signed out')
    } catch (error) {
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.body.id)
        res.status(200).json('User has been deleted')
    } catch (error) {
        next(error)
    }
}

const resendEmail = async (req, res, next) => {
    const { email } = req.body
    try {
        const user = await User.findOne({email})
        console.log(user);
        if (!user) {
            return next(errorHandler(400, 'User does not exist, please register first'))
        }
        if (user.verified) {
            return next(errorHandler(400, 'User has already been verified'))
        }

        const OTP = generateOTP()
        const verificationToken = new VerifyToken({
        owner: user._id,
        token: OTP
    })

        await verificationToken.save()

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.USERNAME_NODEMAILER,
              pass: process.env.PASS_NODEMAILER,
            }
          });
          
        let mailOptions = {
            from: process.env.USERNAME_NODEMAILER,
            to: email,
            subject: 'Verify your email account',
            text: `This is your 4 number verification code: ${OTP}`
          };
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return next(errorHandler(404, 'Error Sending Email'))
            } else {
                return res.json({ success: true, message: 'Email Sent'})
            }
        })
        res.status(200).json('Email has been sent')
    } catch (error) {
        next(error)
    }
}

export {createUser, loginUser, verifyEmail, logoutUser, deleteUser, resendEmail}