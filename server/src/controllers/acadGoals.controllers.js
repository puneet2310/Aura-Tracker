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
        status: "Active",
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

    const {_id, title, description, targetDate, isComplete, status} = req.body

    const goalTobeUpdated = await AcademicGoals.findById(_id)
    console.log("Goal to be updated :", goalTobeUpdated)

    try {
        //goalTobeUpdated.description = newDescription

        const result = await AcademicGoals.findByIdAndUpdate(
            _id,
            {
                title,
                description: description,
                targetDate,
                isComplete: isComplete,
                status: status
            },
            {new: true}
        )

        console.log(isComplete)
        let user
        if (isComplete) {
            user = await User.findByIdAndUpdate(
                req.user._id,
                {
                    $inc: { acadAura: 10 } // Increment acadAura by 10
                },
                { new: true }
            );
        }
        console.log("Result after update :", result)
        console.log("User :", user)

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

    const {id, status} = req.body
    console.log("Id to be deleted :", id)

    const goal = await AcademicGoals.findByIdAndDelete(id)
    console.log("Goal to be deleted :", goal)

    // Remove the goal from the user's academicGoals array once that particular goal is deleted from academicGoals collection
    const updatedGoals = await User.findByIdAndUpdate(
        req.user._id, 
        {
            $pull: {academicGoals: id} ,
        },
        {new: true} //Returns the updated document after the update is applied, Without this, it would return the document before modification
    )

    if(status === "Completed"){
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $inc: { acadAura: -10 } // Decrement acadAura by 10
            },
            { new: true }
        );
    }

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