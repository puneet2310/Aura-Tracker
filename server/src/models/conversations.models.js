import monggose from 'mongoose'

const conversationSchema = new monggose.Schema({
    participants: [
        {
            type: monggose.Schema.Types.ObjectId,
            ref: "User",    // For Individuals
        }
    ],
    groupId: {
        type: monggose.Schema.Types.ObjectId,
        ref: "ChatGroup" // For Groups
    },
    message: [
        {
            type: monggose.Schema.Types.ObjectId,
            ref: "Message",
            default: []
        }
    ]
}, {
    timestamps: true
})

export const Conversation = monggose.model("Conversation", conversationSchema)