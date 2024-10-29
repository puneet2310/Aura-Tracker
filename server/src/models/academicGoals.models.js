/*
  id string pk
  title string
  description string
  targetDate Date
  isComplete Boolean
*/


import mongoose, {Schema} from "mongoose";


const acadGoalsSchema = new Schema(
    {
        title:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        targetDate:{
            type: Date,
            required: true
        },
        isComplete:{
            type: Boolean,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    }, {timestamps: true}
)


export const AcademicGoals = mongoose.model("AcademicGoals", acadGoalsSchema)