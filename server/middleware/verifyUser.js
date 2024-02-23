import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js'

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(401, 'Unauthorized'))
    }
    jwt.verify(token, process.env.VITE_JWT_TOKEN, (err, user) => {
        if (err) {
            return next(errorHandler(402, 'Unauthorized'))
        }
        //If there are no errors and user is authorized
        req.user = user
        next()
    })
}