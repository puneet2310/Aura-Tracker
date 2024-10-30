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

    const goals = await AcademicGoals.find({user: req.user._id})
    console.log("Goals from controller",goals)

    return res.status(200)
        .json(
        new ApiResponse(200, goals, "Academic goals fetched successfully")
        )
})

const updateAcadGoal = asyncHandler(async (req, res) => {
    
    console.log("Req.body :", req.body)
    // console.log("Req.user :", req.user)

    const {id, title, description, targetDate, completed} = req.body

    const goalTobeUpdated = await AcademicGoals.findById(id)
    console.log("Goal to be updated :", goalTobeUpdated)

    try {
        //goalTobeUpdated.description = newDescription

        const result = await AcademicGoals.findByIdAndUpdate(
            id,
            {
                title,
                description: description,
                targetDate,
                isComplete: completed
            },
            {new: true}
        )
        console.log("Result after update :", result)

        return res
            .status(200)
            .json(
                new ApiResponse(200, result, "Academic goal updated successfully")
                )
    } catch (error) {
        console.log("Error updating goal:", error);
        
    }


})

const deleteAcadGoal = asyncHandler(async (req, res) => {
    console.log("Req.user :", req.user)

    const {id} = req.body
    console.log("Id to be deleted :", id)

    const goal = await AcademicGoals.findByIdAndDelete(id)
    console.log("Goal to be deleted :", goal)

    const updatedGoals = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {academicGoals: id}
        },
         //Returns the updated document after the update is applied, Without this, it would return the document before modification
    )

    console.log("Updated goals :", updatedGoals)
    console.log("Deleted goal successfully")

    return res.status(200)
    .json(
        new ApiResponse(200, null, "Academic goal deleted successfully")
        )
    
})
export {
    setAcadGoals,
    getAcadGoals,
    updateAcadGoal,
    deleteAcadGoal
}