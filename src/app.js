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

export { app }