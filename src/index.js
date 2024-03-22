// require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import connectDB from "./db/database.js";

dotenv.config(
    {
        path: './env'
    }
);

connectDB()


















/*
import express from 'express'
const app = express();

const port = process.env.PORT || 4000

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