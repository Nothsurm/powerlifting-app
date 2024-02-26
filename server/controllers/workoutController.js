import { errorHandler } from "../middleware/error.js";
import Workout from "../models/workoutModel.js";

const newWorkout = async (req, res, next) => {
    const {userId, workoutId, title, category, description} = req.body

    try {
        const workout = new Workout({
            userId,
            workoutId,
            title,
            category,
            description
        });
        await workout.save()
        res.status(200).json(workout)
    } catch (error) {
        next(error)
    }
}

export {newWorkout}