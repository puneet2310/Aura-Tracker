import { asyncHandler } from "../utils/asyncHandler.js";
import { AcademicGoals } from "../models/academicGoals.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/Apierror.js";
import { User } from "../models/user.models.js";

const setAcadGoals = asyncHandler(async (req, res) => {

    const {title, description, targetDate} = req.body

    if(!title){
        throw new ApiError(400, "Title is required")
    }
    if(!description){
        throw new ApiError(400, "Title is required")
    }
    if(!targetDate){
        throw new ApiError(400, "Title is required")
    }

    console.log("Req.user :", req.user)

    const goal = await AcademicGoals.create({
        title,
        description, 
        targetDate,
        isComplete: false,
        user: req.user._id // set by the auth middleware during verifying the JWT
    })

    console.log("Goal is: ",goal)

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $push: {academicGoals: goal._id}            
        },
        {new: true}  //Returns the updated document after the update is applied, Without this, it would return the document before modification
    )

    return res.status(201)
        .json(
        new ApiResponse(201, goal, "Academic goal created successfully")
        )
})

const getAcadGoals = asyncHandler(async (req, res) => {

    const goals = await AcademicGoals.find({user: req.user._id}).lean().exec()
    console.log("Goals from controller",goals)

    return res.status(200)
        .json(
        new ApiResponse(200, goals, "Academic goals fetched successfully")
        )
})

export {
    setAcadGoals,
    getAcadGoals
}