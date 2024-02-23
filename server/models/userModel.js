import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 20
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
        minLength: 5
    },

    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },

    verified: {
        type: Boolean,
        default: false,
        required: true,
    }
}, {timestamps: true})

const User = mongoose.model('User', userSchema)

export default User