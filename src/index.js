// require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import connectDB from "./db/database.js";
import { app } from './app.js';
import { port } from './constants.js';

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.on("error", (err) => {
        console.log("ERROR: Connection failed from Database side..!");
    });

    app.listen(port, () => {
        console.log(`Server is listening on port no. ${port}`);
    })
})
.catch((err) => {
    console.log(err?.message || "Database connection failed in index...!");
})


















/*
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import express from 'express'
const app = express();

const port = process.env.PORT || 8000
dotenv.config({
    path: './.env'
})
; (async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)

        app.on("error", (error) => {
            console.log("ERROR: Error from Database...!");
            throw error;
        })

        app.listen(port, () => {
            console.log(`Database is listening on PORT ${port}`);
        })
    } catch (error) {
        console.log("ERROR: Error while connecting to Databse...!");
    }
})()
*/