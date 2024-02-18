import User from "../models/userModel.js"
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../middleware/error.js"

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

export {createUser}