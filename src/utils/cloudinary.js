import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import { cloudinaryApiKey, cloudinaryApiSecret, cloudinaryCloudName } from '../constants.js';
import { ApiError } from './ApiError.js';



cloudinary.config({
    cloud_name: cloudinaryCloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret
});

const uploadOnCloudinary = async (localeFilePath) => {
    try {
        if (!localeFilePath) {
            console.log("Locale File Path is not present...!");
            return null
        }

        const uploadedFileResponse = await cloudinary.uploader.upload(localeFilePath, {
            resource_type: "auto"
        })
        // console.log("File Uploaded Successfully || URL is : ", uploadedFileResponse.url);
        fs.unlinkSync(localeFilePath)
        return uploadedFileResponse;
    } catch (error) {
        fs.unlinkSync(localeFilePath)
        console.log("File Path didn't found || File didn't Uploaded, ERROR : ", error);
        return null
    }
}

const deleteFromCloudinary = async (resourceId) => {
    try {
        if (!resourceId) {
            throw new ApiError(401, "Resource File is not present..!")
            return null
        }
        const uploadedResource = await cloudinary.uploader.destroy(resourceId);
        return uploadedResource;
    } catch (error) {
        throw new ApiError(500, "Could not delete the file...!")
    }
}

export { uploadOnCloudinary, deleteFromCloudinary }