import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/Apierror.js";
import { Message } from "../models/message.models.js";
import { Conversation } from "../models/conversations.models.js";
import { getRecieverSocketId } from "../socket.js";
import { io } from "../socket.js";
import { User } from "../models/user.models.js";
import { ChatGroup } from "../models/chat-group.models.js";

const sendMessage = asyncHandler(async (req, res) => {
    try {
        console.log("sending...");
        console.log(req.body)
        const { message } = req.body;
        const { id: recieverId } = req.params;
        const senderObjectId = req.user._id;

        // Ensure both IDs are valid ObjectId instances
        // const senderObjectId = mongoose.Types.ObjectId(senderId);
        const recieverObjectId = new mongoose.Types.ObjectId(recieverId);

        console.log(message, recieverObjectId, senderObjectId);

        let conversation = await Conversation.findOne(
            {
                participants: { $all: [senderObjectId, recieverObjectId] },
            }
        );

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderObjectId, recieverObjectId],
            });
        }

        const newMessage = await Message.create({
            senderId: senderObjectId,
            recieverId: recieverObjectId,
            message,
        });

        if(newMessage){
            console.log("conversation", conversation);
            conversation.message.push(newMessage._id);
            await conversation.save();
        }
        console.log("newMessage", newMessage);

        const receiverSocketId = getRecieverSocketId(recieverId);

        if(receiverSocketId){
            console.log(receiverSocketId)
            //io.to() is used ot send the events to a specific client
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        
        return res
            .status(201)
            .json(new ApiResponse(201, newMessage, "Message sent successfully"));
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Failed to send message");
    }
});

const getMessages = asyncHandler(async (req, res) => {
    try {

        const {id: userToChatId} = req.params;
        const senderObjectId = req.user._id;
        const userToChatObjectId = new mongoose.Types.ObjectId(userToChatId);


        const conversation = await Conversation.findOne({
            participants: { $all: [senderObjectId, userToChatObjectId] },
        });

        if (!conversation) {
            return res.status(502).json(new ApiResponse(false, "Conversation not found"));
        }

        console.log(conversation)

        const messages = await Message.find({
            _id: { $in: conversation.message },
        })

        console.log(messages)

        return res
            .status(200)
            .json(messages);
        
    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Failed to get messages")
    }
})

const sendMessageInGroups = asyncHandler(async (req, res) => {
    try {
        const { message } = req.body;
        const senderId = req.user._id; 
        const { groupId } = req.params;

        const group = await ChatGroup.findById(groupId).populate("members", "_id");
        if (!group) {
            throw new ApiError(404, "Group not found");
        }

        if (!group.members.some(member => member._id.toString() === senderId.toString())) {
            throw new ApiError(403, "You are not a member of this group");
        }

        let conversation = await Conversation.findOne({ groupId });
        if (!conversation) {
            conversation = await Conversation.create({
                groupId,
            });
        }


        const newMessage = await Message.create({
            senderId,
            recieverId: groupId, // Group ID acts as receiver ID
            message,
        });

        if (newMessage) {
            conversation.message.push(newMessage._id);
            await conversation.save();
        }

        // Notify all members in the group
        io.to(groupId).emit("newGroupMessage", {
            newMessage,
            groupId,
        });

        return res
            .status(201)
            .json(new ApiResponse(201, newMessage, `Message sent successfully in group ${groupId}`));

    } catch (error) {
        console.error("Error in sendMessageInGroups:", error);
        throw new ApiError(500, "Failed to send message in group");
    }
});


const getMessagesOfGroup = asyncHandler(async (req, res) => {
    try {
        const groupId = req.params.groupId;
        console.log("Group ID:", groupId);
        const messages = await Message.find({ recieverId: groupId });
        return res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessagesOfGroup:", error);
        throw new ApiError(500, "Failed to get messages for group");
    }
});



export { sendMessage , getMessages, sendMessageInGroups, getMessagesOfGroup}