const DB_NAME = "UTube"
const corsOrigin = process.env.COR_ORIGIN
const port = process.env.PORT || 8000;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY



export {DB_NAME, corsOrigin, port, accessTokenSecret, accessTokenExpiry, refreshTokenSecret, refreshTokenExpiry}