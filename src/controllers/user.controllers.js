import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import fs from 'fs'

const registerUser = asyncHandler(async (req, res) => {
    // Get User Details from Front end
    const { username, email, password, fullName } = req.body

    // Getting file path from cloudinary
    const avatarLocalePath = req.files?.avatar[0]?.path

    // Getting and checking cover Image
    let coverImageLocalePath;
    if (req.file && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalePath = req.files?.coverImage[0]?.path;
    }

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
        fs.unlinkSync(coverImageLocalePath)
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

export { registerUser }