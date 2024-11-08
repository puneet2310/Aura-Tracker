import { Faculty } from "../models/faculty.models.js";
import { Student } from "../models/students.models.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/Apierror.js";
import { AttendanceRecord } from "../models/attendanceRecord.models.js";
const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};


const checkAttendanceExists = asyncHandler( async (req, res) => {
    const { subject, department, facultyId } = req.body;

    console.log("bdb", req.body)
  
    // Get today's date with only the date part
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Set to midnight

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999); // Set to the end of the day
    // console.log("Today's date:", today);

    const existingAttendance = await AttendanceRecord.findOne({
        subject,
        department,
        facultyId,
        date: {
            $gte: startOfToday,
            $lte: endOfToday
          },
    });

    console.log("Existing attendance:", existingAttendance);

    if (existingAttendance) {
        return res
            .status(200)
            .json({ exists: true, message: "Attendance already recorded for today." });
    } else {
        return res
            .status(200)
            .json({ exists: false });
    }
    
  });
  

const MarkAttendance = asyncHandler(async (req, res) => {
    const { records } = req.body;

    console.log("Request body:", req.body);
    console.log("User (from JWT):", req.user);
  
    if (!Array.isArray(records) || records.length === 0) {
      return res
            .status(400)
            .json(new ApiError("No attendance records provided", 400));
    }
  
    try {
      const attendanceEntries = records.map((record) => {
        const {
          studentId,
          facultyId, 
          subject,
          department,
          date,
          status,
        } = record;
  
        // Check for undefined or missing fields
        if (!studentId || !facultyId || !subject || !department || !date || !status) {
          throw new ApiError("Each record must contain studentId, facultyId, subject, department, date, and status", 400);
        }
  
        const attendanceDate = new Date(date);
        if (isNaN(attendanceDate)) {
          throw new ApiError("Invalid date format in one of the records", 400);
        }
  
        return {
          facultyId,
          studentId,
          subject,
          department,
          date: attendanceDate,
          status,
          weekNumber: getWeekNumber(attendanceDate),
          month: attendanceDate.getMonth() + 1,
          year: attendanceDate.getFullYear(),
        };
      });

      console.log("Attendance entries before saving:", attendanceEntries);
  
      const response = await AttendanceRecord.insertMany(attendanceEntries);
      return res
        .status(201)
        .json(new ApiResponse("Attendance marked successfully", 201));

    } catch (error) {
      console.error("Error saving attendance records:", error);
      return res.status(error.statusCode || 500).json(new ApiError(error.message || "Failed to mark attendance", 500));
    }
});


  
  
  export {
    checkAttendanceExists,
    MarkAttendance,
    // getAttendanceRecords,
  };
  
  