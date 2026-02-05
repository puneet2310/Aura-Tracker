// server/src/controllers/timetable.contollers.js
import { redisClient } from "../db/redis.js";
import ClassSchedule from "../models/ClassSchedule.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getTimetable = asyncHandler(async (req, res) => {
    const { stream, semester } = req.params;
    const cacheKey = `timetable:${stream}:${semester}`;

    // 1. SILENT REDIS GET
    try {
        if (redisClient.isOpen) {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                return res.status(200).json(
                    new ApiResponse(200, JSON.parse(cachedData), "Fetched from cache")
                );
            }
        }
    } catch (err) {
        console.log("Redis Cache Miss/Error:", err.message);
    }

    // 2. MONGODB FETCH (The Backup)
    const schedule = await ClassSchedule.find({ stream, semester });

    if (!schedule || schedule.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "Schedule not found"));
    }

    // 3. SILENT REDIS SET (Save for next time)
    try {
        if (redisClient.isOpen) {
            await redisClient.set(cacheKey, JSON.stringify(schedule), { EX: 86400 });
        }
    } catch (err) {
        console.log("Redis Save Error:", err.message);
    }

    return res.status(200).json(
        new ApiResponse(200, schedule, "Fetched from DB")
    );
});

const editTimeTable = asyncHandler(async (req, res) => {
    const semester = "Semester " + req.params.semester;
    const stream = req.params.stream;
    const { day, subject, instructor, startTime, endTime } = req.body;

    const schedule = await ClassSchedule.findOne({ stream, semester });
    if (!schedule) throw new ApiError(404, "Schedule not found");

    // ... Update logic (omitted for brevity) ...
    await schedule.save();

    // 4. GRACEFUL CACHE INVALIDATION
    try {
        if (redisClient.isOpen) {
            await redisClient.del(`timetable:${stream}:${semester}`);
        }
    } catch (err) {
        console.log("Redis Delete Error:", err.message);
    }

    return res.status(200).json(new ApiResponse(200, schedule, "Updated successfully"));
});

export { getTimetable, editTimeTable };