import mongoose, { Schema } from "mongoose";
import { User } from "./user.models.js";

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
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
    }
})

export const Faculty = mongoose.model("Faculty", faculty);

