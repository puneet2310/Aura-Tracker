import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Student } from "../models/students.models.js";
import { ApiError } from "../utils/Apierror.js";

const updateProfile = asyncHandler(async (req, res) => {
    console.log("in the student chamber")
    console.log(req.body)
    const { fullName, email, userName, mobNo, stream, semester, regNo } = req.body;
    
    

    const currentUser = req.user; // assuming req.user contains the authenticated user's information
    console.log("currentUser: ", currentUser)


    // Update the general user information
    const user = await User.findByIdAndUpdate(
        currentUser._id,
        { fullName, email, userName, mobNo, }, // update fields excluding password
        { new: true}
    );

    console.log("user: ", user)

    if (!user) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "User not found"));
    }

    const existedStudent = await Student.findOne({
        $or: [{ mobNo}, { regNo }],
      });
    
    if (existedStudent) {
        console.log("See here : ", existedStudent)
        throw new ApiError(403, "Registration number or MobNo already exists");
    }

    // Now handle student-specific fields
    let updatedStudent = await Student.findOneAndUpdate(
        { user: currentUser._id }, // Match the student using the user reference
        { stream, semester, regNo, mobNo }, // Update the student-specific fields
        { new: true }
    );

    // If the student doesn't exist, create a new student
    if (!updatedStudent) {
        console.log("Creating new student")
        

        updatedStudent = await Student.create({
            user: currentUser._id, // reference to the user
            regNo,
            semester,
            stream,
            mobNo,
        });
    }

    // Update the user reference in the student document
    user.student = updatedStudent._id;
    await user.save();

    console.log("updatedUser: ", user)
    console.log("updatedStudent: ", updatedStudent)

    return res
        .status(200)
        .json(new ApiResponse(200, { user, updatedStudent }, "Profile updated successfully"));
});

const getProfile = asyncHandler(async (req, res) => {
    const currentUser = req.user;
    const user = await User.findById(currentUser._id);

    if (!user) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "User not found"));
    }
    const student = await Student.findOne({ user: currentUser._id });

    console.log("user: ", user)
    console.log("student: ", student)


    const responseData = {
        user: user,
        student: student || {},
    };
    return res
        .status(200)
        .json(new ApiResponse(200, responseData, "Profile fetched successfully"));
});

export { updateProfile, getProfile };