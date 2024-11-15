import jwt from 'jsonwebtoken';
import { User } from "../models/user.models.js";
import { ApiError } from '../utils/Apierror.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
    console.log("Verifying JWT");

    // Retrieve token from cookies or Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Authentication token missing");
    }

    try {
        // Verify the token using the secret key
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Fetch the user details excluding sensitive fields
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "User not found or invalid token");
        }

        // Attach user object to the request for use in subsequent middleware
        req.user = user;

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error while verifying token:", error.message);

        // Handle specific token errors
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Token has expired. Please login again.");
        }

        // Generic token error
        throw new ApiError(401, "Invalid authentication token");
    }
});