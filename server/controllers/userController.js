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

    const userExists = await User.findOne({email})
    if (userExists) {
        return next(errorHandler(400, 'This Email already exists'))
    }
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
                return res.json({ 
                    success: true, 
                    message: 'Email Sent',
                    _id: newUser._id, 
                    username: newUser.username, 
                    email: newUser.email, 
                    isAdmin: newUser.isAdmin,

                })
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

const google = async (req, res, next) => {
    const {name, email, googlePhotoUrl} = req.body;

    try {
        const user = await User.findOne({email})
        if (user) {
            const token = generateToken(res, user._id)
            const { password, ...rest} = user._doc
            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(rest)
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-3),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
                verified: true
            })
            await newUser.save()
            const token = generateToken(res, newUser._id)
            const { password, ...rest} = newUser._doc
            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(rest)
        }
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
    const user = await User.findById(req.params.userId)

    if (user) {
        try {
            await User.deleteOne({_id: user._id})
            res.clearCookie('access_token')
            res.status(200).json('User has been deleted')
        } catch (error) {
            next(error)
        }
    }
}

const updateUser = async (req, res, next) => {
    if (req.body.password) {
        if (req.body.password.length < 5) {
            return next(errorHandler(401, 'Password must be at least 5 characters'))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    if (req.body.username) {
        if (req.body.username.length < 5 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'))
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username must contain no spaces'))
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lowercase'))
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Username can only contain letters and numbers'))
        }
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password
            }
        }, {new: true})
        const { password, ...rest } = updatedUser._doc
        res.status(200).json(rest)
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
            text: `This is your 4 number verification code: ${OTP} \n\n Please click the link below and enter your code\n` + `http://localhost:5173/verify-email/${user._id}`
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

const forgotPassword = async (req, res, next) => {
    const {email} = req.body
    try {
        const user = await User.findOne({email})
        if (!user) {
            return next(errorHandler(404, 'This User does not exist'))
        }
        
        const token = generateToken(res, user._id)

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USERNAME_NODEMAILER,
                pass: process.env.PASS_NODEMAILER
            }
            });
              
        let mailOptions = {
            from: process.env.USERNAME_NODEMAILER,
            to: email,
            subject: 'Reset Password',
            text: 'Please clink the link below to reset your password, this link will expire in 10 minutes ' + `https://localhost:5173/resetPassword/${token}`
                
            };
              
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return res.json({ message: 'error sending Email'})
            } else {
                return res.json({ success: true, message: 'Email Sent'})
            }
        });
    } catch (error) {
        next(error)
    }
}

export {createUser, loginUser, verifyEmail, logoutUser, deleteUser, resendEmail, updateUser, google, forgotPassword}