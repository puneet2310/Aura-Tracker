import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/Apierror.js";
import { User } from "../models/user.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import oauth2Client from '../utils/googleConfig.js'
import axios from 'axios'
import crypto from 'crypto'
import { Student } from "../models/students.models.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      //todo
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error while generating access and refresh token", error);
    throw new ApiError(500, "Error while generating access and refresh token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  console.log("req.body", req.body);
  const { fullName, email, userName, password } = req.body;
  console.log(
    "fullName, email, userName, password",
    fullName,
    email,
    userName,
    password
  )

  //validation
  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "") 
    //some is used to check if any of the field is empty and trim is used to remove spaces
  ) {
    throw new ApiError(400, "All fileds are required");
  }

  //check wheter is user exists in database already or not
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    console.log("See here : ", existedUser)
    throw new ApiError(403, "User already exists");
  }
  

  //handle the images (images comes in file gives by the multer)
  console.warn(req.files);
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  // if (!avatarLocalPath) {
  //   throw new ApiError(402, "Avatar file is missing");
  // }

  //upload it on clodinary and we only take a url for that
  // const avatar = await uploadOnCloudinary(avatarLocalPath)

  // let coverImage = ""
  // if(coverImageLocalPath){
  //     coverImage = await uploadOnCloudinary(coverImageLocalPath)
  // }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Uploaded avatar", avatar);
  } catch (error) {
    console.log("Error while uploading avatar ", error);
    throw new ApiError(500, "Failed to upload avatar");
  }


  try {
    const user = await User.create({
      fullName,
      email,
      password,
      userName: userName.toLowerCase(),
      avatar: avatar?.url || "",
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering a user");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User Registered Scuccessfully"));
  } catch (error) {
    console.log("User creation failed", error);

    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }

    throw new ApiError(
      500,
      "Something went wrong while registering a user and images were deleted"
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  //get data from body
  console.log("req.body", req.body);
  const { userName, password } = req.body;

  //validation
  if (!userName) {
    throw new ApiError(400, "Username is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  //It searches for a user where either the userName or email matches the provided values.
  const user = await User.findOne({ $or: [{ userName }, { email: userName }] });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  //validate password
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ).populate('student');

  if (!loggedInUser) {
    throw new ApiError(500, "Something went wrong while login");
  }

  const cookieOptions = {
    httpOnly: true, // Prevents access via JavaScript
    secure: process.env.NODE_ENV === "deployment", // Secure only in production
    sameSite: "none", // Required for cross-origin cookies (Vercel → Render)
  };

  console.log("User logged in successfully");
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken},
        "User logged in successfully"
      )
    );
});

const googleLogin = async (req,res) => {

  try {
      const {code} = req.query;
      console.log("from controller",code)

      const googleRes = await oauth2Client.getToken(code)
      console.log("googleRes: ",googleRes)
      oauth2Client.setCredentials(googleRes.tokens)

      // Using the access token, the function makes a request to Google’s user info endpoint to retrieve user details
      const userRes = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
          headers: {
              Authorization: `Bearer ${googleRes.tokens.access_token}`
          }
      })

      console.log("userRes: ",userRes.data)

      const {email, name, picture} = userRes.data

      const existingUser = await User.findOne({email})
      console.log("existingUser: ",existingUser)

      let user = existingUser
      
      if(!existingUser){
        const generatedPassword = crypto.randomBytes(32).toString('hex')  
        user = await User.create({
          fullName:name,
          email,
          password: generatedPassword,
          userName: name.toLowerCase(),
          avatar: picture || "",
        })
      }

      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
      );
    
      const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );
    
      if (!loggedInUser) {
        throw new ApiError(500, "Something went wrong while login");
      }
    
      const options = {
        httpOnly: true, // this makes the cookie non modifieable from the client side
        secure: process.env.NODE_ENV === "production",
      };
    
      console.log("User logged in successfully");
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refresToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            { user: loggedInUser, accessToken, refreshToken },
            "User logged in successfully"
          )
        );
  } catch (error) {
      console.log("Error while requesting google code", error)
      res.status(500).json({error: error.message})
  }

}

const refreshAccessToken = asyncHandler(async (req, res) => {

  const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    console.log("Incoming refresh token" , incomingRefreshToken)

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    console.log("Entering")

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log(decodedToken)
        const user = await User.findById(decodedToken?._id);
        console.log(user)
        
        //Is there a user with this ID?" (existence)
        if (!user) {
            throw new ApiError(404, "Invalid refresh token");
        }

        //Is the user's refresh token still valid? " (validity) --> may be user come after the expiry time
        if (user.refreshToken !== incomingRefreshToken) {
            // console.log(user.refreshAccessToken, incomingRefreshToken)
            throw new ApiError(401, "Refresh token is expired");
        }

        const options = {
            httpOnly: true, // this makes the cookie non modifieable from the client side
            secure: process.env.NODE_ENV === "production",
        };

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        console.log("Refreshed access token", accessToken);
        console.log("Refreshed refresh token", newRefreshToken);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                200,
                { accessToken, refreshToken: newRefreshToken },
                "Access Token refreshed successfully"
                )
            );
    } catch (error) {
        console.log("Error while refreshing access token", error);
        throw new ApiError(500, "Error while refreshing access token");
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
        $set: {
            "refreshToken": null, // update in the database
        },
        },
        { new: true }
    );

    console.log(user)

    if(!user){
        console.log("User not found while logging out");
        throw new ApiError(404, "User not found");
    }

    const options = {
        httpOnly: true, // this makes the cookie non modifieable from the client side
        secure: process.env.NODE_ENV === "production",
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)  //delete the cookie to client's browser
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, null, "User logged out successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    console.log(req.user?._id);
    const user = await User.findById(req.user?._id);
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) {
        console.log("Old password is incorrect while updating password");
        throw new ApiError(400, "Old password is incorrect");
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { userName, fullName, email, role, regNo, semester, stream } = req.body;

  // if (!fullName || !email) {
  //   throw new ApiError(400, "Full name and email are required");
  // }

  // if(email !== email.toLowerCase()){
  //   throw new ApiError(400, "Email must be in lowercase");
  // }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        userName,
        fullName,
        email,
        role,
        regNo,
        semester,
        stream
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const {role, regNo, semester, stream} = req.body;
  const currentUser = req.user;
  
  try {
    const user = await User.findByIdAndUpdate(
      currentUser?._id,
      {
        $set: {
          role,
          regNo,
          semester,
          stream,
        },
      },
      { new: true }
    ).select("-password -refreshToken");
  
    console.log("User details is: ", user)

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Account details updated successfully"));

  } catch (error) {
    console.log("Error while updating user details: ", error);
    throw new ApiError(500, "Error while updating user details");
  }

  return 
})

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(500, "Error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const calculateAcadAura = asyncHandler(async (req, res) => {
  const userId = req.user._id; 

  const completedGoals = await User.aggregate([
    {
      $match: { _id: userId } // Match the specific user
    },
    {
      $lookup: {
        from: 'academicgoals',         // The name of your academic goals collection
        localField: 'academicGoals',  // The field in the User collection that contains the goal IDs
        foreignField: '_id',         // The field in the AcademicGoals collection that contains the ID
        as: 'goals'                 // Name of the new array to hold the joined documents
      }
    },
    {
      $unwind: {
        path: '$goals',
        preserveNullAndEmptyArrays: true // Preserve users even if they have no goals
      }
    },
    {
      $match: {
        'goals.isComplete': true // Filter for completed goals
      }
    },
    {
      $count: 'goalsCompleted' // Count the number of completed goals
    }
  ]);

  // Extract the count if there are any completed goals
  console.log(completedGoals)
  let goalsCompleted = completedGoals.length > 0 ? completedGoals[0].goalsCompleted : 0;

  console.log("Number of goals completed: ", goalsCompleted);

  return res
    .status(200)
    .json(new ApiResponse(200, goalsCompleted, "No of goals completed: " + goalsCompleted));
});

const leaderboard = asyncHandler(async (req, res) => {
  const users = await User.find({
    role: "Student",                  // Filter for only students
  }).sort({ acadAura: -1 });  
  console.log("LeaderBoard: ",users)
  
  return res
    .status(200)
    .json(new ApiResponse(200, users, "Leaderboard fetched successfully"));

})

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  googleLogin,
  calculateAcadAura,
  leaderboard,
  updateProfile
};
