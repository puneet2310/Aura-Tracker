import mongoose, {Schema} from "mongoose";
import { User } from "./user.models.js";

const student = new Schema({
    regNo: {
        type: Number,
        unique: true,
        // required: true,
    },
    semester: {
        type: Number,
        // required: true,
    },
    stream: {
        type: String,
        // required: true,
    },
    mobNo: {
        type: Number,
        unique: true,
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


export const Student = mongoose.model("Student", student);


