import mongoose, { Schema } from "mongoose";
import { User } from "./user.models.js";
import { AttendanceRecord } from "./attendanceRecord.models.js";
const faculty = new Schema({
    facultyId: {
        type: Number,
        // required: true,
        unique: true,
    },
    department: {
        type: String,
        // required: true,
    },
    experience: {
        type: Number,
        // required: true,
    },
    attendanceRecords: [
    {
        type: Schema.Types.ObjectId,
        ref: 'AttendanceRecord'
    }
    ],
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
    }
})

export const Faculty = mongoose.model("Faculty", faculty);

