import express from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { corsOrigin } from './constants.js';

const app = express();

app.use(cors({
    origin: corsOrigin,
    credentials: true
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"))

app.use(cookieParser());


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js'

import videoRouter from "./routes/video.routes.js"


//routes declaration

app.use("/api/v1/users", userRouter)

app.use("/api/v1/videos", videoRouter)


// http://localhost:8000/api/v1/users/register

export { app }