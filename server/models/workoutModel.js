import mongoose from 'mongoose'

const workoutSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    image: {
        type: String,
    },

    description: {
        type: String,
    },
}, {timestamps: true})

const Workout = new mongoose.model('Workout', workoutSchema)

export default Workout