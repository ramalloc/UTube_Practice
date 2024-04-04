import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import jwt from "jsonwebtoken"
import fs from 'fs'
import { refreshTokenSecret } from "../constants.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Unable to generate tokens...!")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // Get User Details from Front end
    const { username, email, password, fullName } = req.body

    // Getting file path from cloudinary
    const avatarLocalePath = req.files?.avatar[0]?.path
    console.log(avatarLocalePath);

    // Getting and checking cover Image
    // console.log(req.files);
    let coverImageLocalePath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalePath = req.files?.coverImage[0]?.path;
    }
    console.log(coverImageLocalePath);

    // validation for data present or not
    if (
        [fullName, username, email, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required...!")
    }

    // Check User already registered or not by email and username
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        fs.unlinkSync(avatarLocalePath)
        if (coverImageLocalePath) {
            fs.unlinkSync(coverImageLocalePath)
        }
        throw new ApiError(408, "User with username or email already exist...!")
    }

    // Checking files is present or not
    if (!avatarLocalePath) {
        throw new ApiError(401, "Avatar file is required...!")
    }

    // upload the file into cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalePath)
    let coverImage;
    if (coverImageLocalePath) {
        coverImage = await uploadOnCloudinary(coverImageLocalePath)
    }

    // checking avatar or coverImage uploaded on cloudinary or not
    if (!avatar) {
        throw new ApiError(401, "Avatar file didn't uploaded on cloud...!")
    }

    // create user object to send and to save data in DB
    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    // remove password from and refresh token from response field
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Server Internal Error, Unable to create User...!")
    }

    // return user response
    return res.status(200).json(
        new ApiResponse(201, createdUser, "User Registered Successfully...")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(401, "username or email is required...!");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(403, "user doesn't exist...!")
    }

    if (!password) {
        throw new ApiError(402, "password is required...!");
    }

    const isPassword = await user.isPasswordCorrect(password);
    if (!isPassword) {
        throw new ApiError(400, "password is incorrect...!")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true
    }

    console.log("refreshToken : ", refreshToken, "\n accessToken : ", accessToken);

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(201, {
                user: loggedInUser, accessToken, refreshToken
            },
                "User logged in successfully..."
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    );

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(
            new ApiResponse(200, {}, "User logged out successfully...")
        )

})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken
        || req.body.refreshToken
        || req.header("Authorization")?.replace("Bearer ", "");

    if (!incomingRefreshToken) {
        throw new ApiError(402, "Unauthorized Access...!");
    }
    try {
        const decodedRefreshToken = jwt.verify(incomingRefreshToken, refreshTokenSecret);

        const user = await User.findById(decodedRefreshToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh Token...!")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(400, "refresh Token is expired or used...!");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const cookieOptions = {
            httpOnly: true,
            secure: true
        }

        res.status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    201,
                    { accessToken, refreshToken },
                    "Access and Refresh Token refreshed..."
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh Token...!")
    }
})

export { registerUser, loginUser, logoutUser, refreshAccessToken }