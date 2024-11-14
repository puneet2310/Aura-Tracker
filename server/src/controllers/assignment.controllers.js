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

const getAssignments = asyncHandler(async (req, res) => {

    console.log("req.body: ", req.body)
    const department = req.params.stream
    const semester = req.params.semester
    const subject = req.params.subject

    console.log("Department: ", department , semester, subject)

    const assignments = await Assignment.find({
        semester,
        subject,
        department
    })
    
    console.log("assignments",assignments)

    return res  
        .status(200)
        .json(new ApiResponse(200, assignments, "Assignment fetched successfully"))

})

const submitAssignments = asyncHandler(async(req, res) => {
    const assignmentId = req.params.assignmentId
    const studentId = req.user.student
    console.log("req.body: ", req.body)
    console.log("Assignment Id: ", assignmentId)
    console.log("Student Id: ", studentId)
    console.log("File: ", req.files)

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
    const assignment = await Assignment.findById(assignmentId)
    console.log("Assignment: ", assignment)

    if(!assignment){
        throw new ApiError(404, "Assignment not found")
    }

    try {
        const student = await Student.findById(studentId)
        const faculty = await Faculty.findById(assignment.createdBy)
        console.log("Student: ", student)

        if(!student || !faculty){
            throw new ApiError(404, "Student or Faculty not found")
        }

        assignment.submissions.push({
            student: student._id,
            file: file?.url,
        })

        console.log("Assignment before submission: ", assignment)

        await assignment.save()

        console.log("Assignment after submission: ", assignment)

        return res  
        .status(200)
        .json(new ApiResponse(200, assignment, "Assignment submitted successfully"))

    }
    catch (error) {

        if(file){
            await deleteFromCloudinary(file.public_id)
        }
        console.log("Error while fetching student or faculty", error)
        throw new ApiError(500, "Something went wrong while fetching student or faculty")
    }

})

const isSubmitted = asyncHandler(async(req, res) => {
    const studentId = req.params.student
    const assignmentId = req.params.assignmentId

    const assignment = await Assignment.findById(assignmentId)
    console.log("Response: ", assignment)

    if(!assignment){
        throw new ApiError(404, "Assignment not found")
    }
    const isSubmit = assignment.submissions.some(submission => submission.student.toString() === studentId)
    console.log("Is submitted: ", isSubmit)

    return res
    .status(200)
    .json(new ApiResponse(200, isSubmit, "Submission status fetched successfully"))
})
export {
    uploadAssignment,
    getAssignments,
    submitAssignments,
    isSubmitted
}