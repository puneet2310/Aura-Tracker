import { Faculty } from "../models/faculty.models.js";
import { Student } from "../models/students.models.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/Apierror.js";
import { AttendanceRecord } from "../models/attendanceRecord.models.js";
import { ClassRepresentive } from "../models/classRepresentive.models.js";

const createClassRepresentive = asyncHandler(async (req, res) => {
    // const studentId = await Student.find({user: req.user._id})

    const {studentId ,department, semester } = req.body
    if(!studentId){
        throw new ApiError(400, "Student not found")
    }

    console.log(studentId, department, semester)

    if(!department || !semester){
        throw new ApiError(400, "Please provide all the details")
    }

    const representive = await ClassRepresentive.findOne({department, semester})
    if(representive){
        console.log(representive)
        const response = await ClassRepresentive.findByIdAndUpdate(
            representive._id,
            {
                student: studentId
            },
            {new: true}
        )

        return res
            .status(200)
            .json(new ApiResponse(200, response, "Class Representive updated successfully"))
    }

    const classRepresentive = await ClassRepresentive.create({
        user: req.user._id,
        student: studentId,
        department,
        semester
    })

    console.log(classRepresentive)
    return res
    .status(200)
    .json(new ApiResponse(200, classRepresentive, "Class Representive created successfully"))
})
const getClassRepresentive = asyncHandler(async (req, res) => {
    const department = req.params.department
    const semester = req.params.semester
    console.log(department, semester)

    const classRepresentive = await ClassRepresentive.find({ semester, department })
            .populate({
                path: 'student',
                populate: { path: 'user', select: 'fullName email' } // Adjust fields as needed
            })
            .select('-student.user.password -student.user.refreshToken');    
    console.log(classRepresentive)

    if(!classRepresentive){
        throw new ApiError(400, "Class Representive not found")
    }
    return res.status(200).json(new ApiResponse(200, classRepresentive, "Class Representive fetched successfully"))
})

const checkCRStatus = asyncHandler(async (req, res) => {
    const studentId = req.params.studentId
    const user = await User.findById(studentId)
    if(!user){
        throw new ApiError(400, "User not found")
    }
    console.log(user)
    const isCR = await ClassRepresentive.findOne({student: user.student})
    if(isCR){
        return res.status(200).json(new ApiResponse(200, {isCR: true}, "User is Class Representive"))
    }
    return res.status(200).json(new ApiResponse(200, {isCR: false}, "User is not Class Representive"))
})
export {
    createClassRepresentive,
    getClassRepresentive,
    checkCRStatus
}