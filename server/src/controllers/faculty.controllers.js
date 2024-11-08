import { Faculty } from "../models/faculty.models.js";
import { Student } from "../models/students.models.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/Apierror.js";

const updateProfile = asyncHandler(async (req, res) => {
    console.log("In the faculty chamber")
    const { fullName, email, userName, mobNo, department, facultyId, experience} = req.body;
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
    // Now handle student-specific fields
    
    let updatedFaculty = await Faculty.findOneAndUpdate(
        { user: currentUser._id }, // Match the student using the user reference
        { department, facultyId, experience, }, // Update the student-specific fields
        { new: true }
    );
    // If the student doesn't exist, create a new student
    if (!updatedFaculty) {
        const existedFaculty = await Faculty.findOne({
            $or: [ { facultyId }],
        })
    
        if (existedFaculty) {
            console.log("See here : ", existedFaculty)
            throw new ApiError(403, "Faculty ID already exists");
        }
        console.log("Creating new student")
        updatedFaculty = await Faculty.create({
            user: currentUser._id, // reference to the user
            department,
            facultyId,
            experience,
        });
    }
    // console.log("updatedUser: ", user)
    console.log("UpdatedFaculty", updatedFaculty)
    // Update the user reference in the student document

    user.faculty = updatedFaculty._id;
    await user.save();
    console.log("updatedUser: ", user)

    return res
        .status(200)
        .json(new ApiResponse(200, { user, updatedFaculty }, "Profile updated successfully"));

})
const getProfile = asyncHandler(async (req, res) => {
    const currentUser = req.user;
    const user = await User.findById(currentUser._id)
    .populate('faculty')
    .select('-password -refreshToken');
    if (!user) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "User not found"));
    }

    const responseData = {
        user: user,
        faculty: user.faculty
    };    
    return res
        .status(200)
        .json(new ApiResponse(200, responseData, "Profile fetched successfully"));
})
const getStudentsList = asyncHandler(async (req, res) => {
    const dept = req.params.department
    console.log("dept: ", dept)
    const students = await Student.find({ stream: dept }).select('user');
    console.log("students: ", students)

    if (!students) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Students not found"));
    }
    
    const studentsWithUser = await Promise.all(students.map(async (student) => {
        const user = await User.findById(student.user).populate('student').select('-password -refreshToken');
        return {
            user,
            student: student
        };
    }));

    console.log("studentsWithUser: ", studentsWithUser)

    return res
    .status(200)
    .json(new ApiResponse(200, studentsWithUser, "Students fetched successfully"));
})
    
export {
    updateProfile,
    getProfile,
    getStudentsList
}