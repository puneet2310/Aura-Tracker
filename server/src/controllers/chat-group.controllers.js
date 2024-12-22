import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/Apierror.js";
import { User } from "../models/user.models.js";
import { ChatGroup } from "../models/chat-group.models.js";

const createChatGroup = asyncHandler(async (req, res) => {
    const { groupName, members } = req.body;
    console.log("Members: ", members);
    console.log("Group Name: ", groupName);
    const chatGroup = await ChatGroup.create({ name:groupName, members });
    return res
        .status(200)
        .json(new ApiResponse(200, chatGroup, "Group has been created"));
});

const getChatGroups = asyncHandler(async (req, res) => {
    const chatGroups = await ChatGroup.findAll();
    console.log("chatGroups: ", chatGroups);
    return res
        .status(200)
        .json(new ApiResponse(200, chatGroups, "Groups fetched successfully"));
})

const addMembers = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { members } = req.body;
    const group = await ChatGroup.findById(groupId);

    if(!group){
        throw new ApiError(404, "Group not found")
    }

    group.members.push(...members); 
    await group.save();
    return res
        .status(200)
        .json(new ApiResponse(200, group, "Members added successfully"));
})

const removeMembers = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { members } = req.body;
    const group = await ChatGroup.findById(groupId);

    if(!group){
        throw new ApiError(404, "Group not found")
    }

    group.members = group.members.filter(member => !members.includes(member));
    await group.save();
    return res
        .status(200)
        .json(new ApiResponse(200, group, "Members removed successfully"));
})

export {
    createChatGroup,
    getChatGroups,
    addMembers,
    removeMembers
}