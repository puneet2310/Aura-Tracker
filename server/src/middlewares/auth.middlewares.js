import jwt from 'jsonwebtoken';
import { User } from "../models/user.models.js";
import { ApiError } from '../utils/Apierror.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
    console.log("Verifying JWT");
    console.log("req.cookies: ", req.cookies);
    console.log("req.header: ", req.header("Authorization"))
    // Retrieve token from cookies or Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        console.log(token);
        throw new ApiError(405, "Authentication token missing");
    }

    try {
        // Verify the token using the secret key
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Fetch the user details excluding sensitive fields
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        console.log("user is in auth middleware: ", user);
        if (!user) {
            throw new ApiError(403, "User not found or invalid token");
        }

        // Attach user object to the request for use in subsequent middleware
        req.user = user;

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error while verifying token:", error.message);

        // Handle specific token errors
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, error.name);
        }

        // Generic token error
        throw new ApiError(402, "Invalid authentication token");
    }
});