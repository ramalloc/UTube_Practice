import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const mongoUrl = process.env.MONGODB_URL;

const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${mongoUrl}/${DB_NAME}`)
        console.log(`MongoDB connected || DB Host is ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("ERROR: Error while connecting to Database...!");
        process.exit(1);
    }
}


export default connectDB;