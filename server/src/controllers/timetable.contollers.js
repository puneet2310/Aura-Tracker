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

export {getTimetable}