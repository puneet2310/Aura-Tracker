import { Faculty } from "../models/faculty.models.js";
import { Student } from "../models/students.models.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/Apierror.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { Assignment } from "../models/assignments.models.js";

const uploadAssignment = asyncHandler(async (req, res) => {
    console.log("Details from body is: ",req.body)
    const {title, description, dueDate, subject, semester, department} = req.body;

    const currentUser = req.user;
    const facultyId = currentUser.faculty;
    
    const fileLocalPath = req.files?.file?.[0].path
    console.log(fileLocalPath)

    let file;
    try {
        file = await uploadOnCloudinary(fileLocalPath)
        console.log("Uploaded file", file)
    } catch (error) {
        console.log("Error while uploading file", error)
        throw new ApiError(500, "Failed to upload file")
    }

    try {
        const assignment = await Assignment.create({
            title,
            subject,
            description,
            dueDate,
            semester,
            department,
            assignment :file?.url, 
            createdBy: facultyId
        })

        return res
        .status(200)
        .json(new ApiResponse(201, assignment, "Assignment uploaded successfully"))

    } catch (error) {
        console.log("Error while uploading the assignment", error)

        if(file){
            await deleteFromCloudinary(file.public_id)
        }

        throw new ApiError(500, "Something went wrong while creating assignment")

    }
   
})

export {
    uploadAssignment
}