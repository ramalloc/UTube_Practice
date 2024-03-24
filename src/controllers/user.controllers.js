import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.models.js";

const registerUser = asyncHandler(async (req, res) => {
    // Get User Details from Front end
    const { username, email, password, fullName } = req.body
    console.log(email);

    // validation for data present or not
    if(
        [fullName, username, email, password].some((field) => 
            field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required...!")
    }

    // Check User already registered or not by email and username
    User.f
    // Checking files is present or not

    // upload the file into cloudinary, checking avat on multer and cloudinary

    // create user object to send and to save data in DB

    // remove password from and refresh token from response field

    // check for user creation

    // return user response



})

export { registerUser }