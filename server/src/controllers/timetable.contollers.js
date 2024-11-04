import ClassSchedule from "../models/ClassSchedule.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getTimetable = asyncHandler(async (req, res) => {
    console.log("In time tabel controller")
    try {
        
        // const branch = req.params.branch
        const branch = 'CSE'
        const schedule = await ClassSchedule.findOne({ branch });

        if (!schedule) {
            return res
                .status(404)
                .json(new ApiResponse(204, schedule, "Schdule not found for queried branch"));
        }

        return res
                .status(400)
                .json(new ApiResponse(200, schedule, "Schedule fetched successfully"))

    } catch (error) {
        console.log("Error in timetable controler: ", error)
        throw new ApiError(400, "Error while fetching timetable")
    }
})

export {getTimetable}