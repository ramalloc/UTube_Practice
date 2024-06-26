import { accessTokenSecret } from "../constants.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
        if(!token){
            throw new ApiError(401, "Unauthorized Access...!")
        }
    
        const decodedAccessToken =  jwt.verify(token, accessTokenSecret);

        const user = await User.findById(decodedAccessToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(402, "Invalid Access Token...!")
        }
    
        req.user = user;

        next();     
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token...!")
    }
})