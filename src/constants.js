const DB_NAME = "UTube"
const corsOrigin = process.env.COR_ORIGIN
const port = process.env.PORT || 8000;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET
const cloudinaryUrl = process.env.CLOUDINARY_URL



export {
    DB_NAME,
    corsOrigin,
    port,
    accessTokenSecret,
    accessTokenExpiry,
    refreshTokenSecret,
    refreshTokenExpiry,
    cloudinaryApiSecret,
    cloudinaryApiKey,
    cloudinaryUrl,
    cloudinaryCloudName
}