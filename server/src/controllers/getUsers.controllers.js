import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/Apierror.js";
import { User } from "../models/user.models.js";
import { ChatGroup } from "../models/chat-group.models.js";

const getAllUsers = asyncHandler(async (req, res) => {
    
    const loggedInUserId = req.user._id;
    const currUserRole = req.user.role;
    const users = await User.find({_id: { $ne: loggedInUserId }}).select("-password -refreshToken" );
    const chatGroup = await ChatGroup.find({members: loggedInUserId}).select("-password -refreshToken");

    //filter by role
    const filteredUsers = users.filter((user) => user.role === currUserRole);
    //sort by name
    filteredUsers.sort((a, b) => a.fullName.localeCompare(b.fullName));
    filteredUsers.push(...chatGroup);

    return res
        .status(200)
        .json(new ApiResponse(200, filteredUsers));
});

const getUsersBySearch = async (req, res) => {
    const { query } = req.query; 
    console.log("Query: ", query)
    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        // Find users whose name contains the search term (case insensitive)
        const users = await User.find({
            fullName: { $regex: `^${query}`, $options: "i" }
        }).select("_id fullName avatar"); 

        console.log("Users: ", users)
        return res.status(200).json(new ApiResponse(200, users));
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    console.log("ID: ", id)
    try {
        const user = await User.findById(id).select("-password -refreshToken");
        if (!user) {
            return res.status(501).json({ message: "User not found" });
        }
        return res.status(200).json(new ApiResponse(200, user));
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

export { getAllUsers, getUsersBySearch, getUserById };