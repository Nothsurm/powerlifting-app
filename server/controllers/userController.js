import User from "../models/userModel.js"
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../middleware/error.js"
import jwt from 'jsonwebtoken'

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

    try {
        await newUser.save()
        res.json('Signup Successfull')
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
        const token = jwt.sign({
            id: validUser._id, isAdmin: validUser.isAdmin
        }, process.env.VITE_JWT_TOKEN)

        const { password: pass, ...rest} = validUser._doc //seperates the password from the rest of the json data

        res.status(200).cookie('access_token', token, {
            httpOnly: true
        }).json(rest)
    } catch (error) {
        next(error)
    }
}

export {createUser, loginUser}