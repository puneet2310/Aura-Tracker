import ClassSchedule from "../models/ClassSchedule.models.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getTimetable = asyncHandler(async (req, res) => {
    console.log("In time tabel controller")
    try {
        const stream = req.params.stream
        const semester = req.params.semester
        // const branch = 'CSE'
        console.log("branch: ", stream)
        console.log("semsester", semester)
        const schedule = await ClassSchedule.find({ stream, semester });
        console.log("schedule: ", schedule)
        console.log("schedule: ", schedule[0].weeklySchedule[0])
        if (!schedule) {
            return res
                .status(400)
                .json(new ApiResponse(404, schedule, "Schdule not found for queried branch"));
        }

        return res
                .status(200)
                .json(new ApiResponse(200, schedule, "Schedule fetched successfully"))

    } catch (error) {
        console.log("Error in timetable controler: ", error)
        throw new ApiError(400, "Error while fetching timetable")
    }
})

const editTimeTable = asyncHandler(async (req, res) => {
    const semester = "Semester " + req.params.semester
    const stream =  req.params.stream

    const {day, subject, instructor, startTime, endTime} = req.body
    
    console.log("details is: ",{day, subject, instructor, startTime, endTime})
    console.log("in edit time table controller")
    console.log("stream: ", stream)
    console.log("semester: ", semester)
    try {
        const schedule = await ClassSchedule.findOne({ stream, semester });
        console.log("schedule: ", schedule)
        if (!schedule) {
            return res
                .status(400)
                .json(new ApiResponse(404, schedule, "Schdule not found for queried branch"));
        }

        //edit the schedule here
        const daySchedule = schedule.weeklySchedule.find(d => d.day === day);
        console.log("daySchedule: ", daySchedule)

        if (daySchedule) {
            // Check if the subject already exists in the day's classes
            const classIndex = daySchedule.classes.findIndex((c) => c.subject === subject);

            if (classIndex !== -1) {
                // Update existing class details
                daySchedule.classes[classIndex] = { subject, instructor, startTime, endTime };
            } else {
                // Add new class entry
                daySchedule.classes.push({ subject, instructor, startTime, endTime });
            }
        } else {
            // Add new day and class entry to the weekly schedule
            schedule.weeklySchedule.push({
                day,
                classes: [{ subject, instructor, startTime, endTime }],
            });
        }

        await schedule.save();
        console.log("updated schedule is: ", schedule.weeklySchedule[0])

        return res
            .status(200)
            .json(new ApiResponse(200, schedule, "Schedule fetched successfully"))
        
        
    } catch (error) {
        console.log("Error in timetable controler: ", error)
        throw new ApiError(400, "Error while fetching timetable")
    }
})

export {
    getTimetable,
    editTimeTable
}