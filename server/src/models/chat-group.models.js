import mongoose from "mongoose";

const chatGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    ],
}, {
    timestamps: true
})

export const ChatGroup = mongoose.model("ChatGroup", chatGroupSchema)