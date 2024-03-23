import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import { cloudinaryApiKey, cloudinaryApiSecret, cloudinaryCloudName, cloudinarySecretKey } from '../constants';



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
        console.log("File Uploaded Successfully || URL is : ", uploadedFileResponse.url);
        return uploadedFileResponse;
    } catch (error) {
        fs.unlink(localeFilePath)
        console.log("File Path didn't found || File didn't Uploaded, ERROR : ", error);
        return null
    }
}

export { uploadOnCloudinary }