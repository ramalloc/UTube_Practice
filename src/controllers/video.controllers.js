import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";



const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // console.log(req.user);
    // TODO: get video, upload to cloudinary, create video
    if (!(title && description)) {
        throw new ApiError(402, "Title and Description are required...!")
    }

    // console.log(req.files?.thumbnail[0]);
    let thumbnailLocal;
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailLocal = req.files.thumbnail[0]?.path
    } else {

        throw new ApiError(401, "Thumbnail file not found...!")
    }

    let videoLocal;
    if (req.files && Array.isArray(req.files.video) && req.files.video.length > 0) {
        videoLocal = req.files.video[0]?.path
    } else {
        throw new ApiError(401, "Video file not found...!")
    }


    const thumbnail = await uploadOnCloudinary(thumbnailLocal)
    const videoFile = await uploadOnCloudinary(videoLocal)

    if (!thumbnail) {
        throw new ApiError(401, "Could not upload thumbnail...!")
    }

    if (!videoFile) {
        throw new ApiError(401, "Could not upload video...!")
    }

    // console.log(thumbnail);
    // console.log(videoFile);
    const video = await Video.create({
        title,
        description,
        thumbnail: thumbnail?.url,
        thumbnailId: thumbnail?.public_id,
        videoFile: videoFile?.url,
        videoFileId: videoFile?.public_id,
        owner: req.user?._id,
        duration: videoFile.duration,
        isPublished: true
    })
    if (!video) {
        throw new ApiError(500, "video not uploaded...!")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video Published Successfully...")
        )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!videoId) {
        throw new ApiError(401, "video ID is required...!")
    }

    try {
        const video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(501, "Video not found...!")
        }

        return res
            .status(201)
            .json(
                new ApiResponse(200, video, "Video fetched Successfully...")
            )
    } catch (error) {
        throw new ApiError(400, error?.message || "Video not found...!")
    }
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new ApiError(401, "video ID is required...!")
    }

    try {
        await deleteFromCloudinary(videoId);
        return res
            .status(200)
            .json(
                new ApiResponse(201, {}, "Video Deleted Successfully...")
            )
    } catch (error) {
        throw new ApiError(500, error?.message || "Could not to delete the video..!")
    }
})

const updateVideoDetails = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    console.log(title);
    console.log(description);
    // console.log(req.user);
    // TODO: get video, upload to cloudinary, create video
    if (!(title && description)) {
        throw new ApiError(402, "Title and Description are required...!")
    }

    const { videoId } = req.params
    if (!videoId) {
        throw new ApiError(401, "video ID is required...!")
    }

    try {
        const video = await Video.findByIdAndUpdate(videoId,
            {
                $set: {
                    title,
                    description
                }
            })
        return res
            .status(200)
            .json(
                new ApiResponse(201, {}, "Video Details Updated Successfully...")
            )   
    } catch (error) {
        throw new ApiError(500, error?.message || "Could not update Video details...!")
    }
})

const updateVideoFile = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if (!videoId) {
        throw new ApiError(401, "Video ID is required...!")
    }

    // let thumbnailLocal;
    // if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
    //     thumbnailLocal = req.files.thumbnail[0]?.path
    // } else {

    //     throw new ApiError(401, "Thumbnail file not found...!")
    // }

    let videoLocal;
    if (req.files && Array.isArray(req.files.video) && req.files.video.length > 0) {
        videoLocal = req.files.video[0]?.path
    } else {
        throw new ApiError(401, "Video file not found...!")
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(401, "Video not found...!")
    }

    const deletedVideo = await deleteFromCloudinary(video?.videoId);

    // const thumbnail = await uploadOnCloudinary(thumbnailLocal)
    const videoFile = await uploadOnCloudinary(videoLocal)

    


})


const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})


export { getAllVideos, getVideoById, publishAVideo, deleteVideo, updateVideoDetails, updateVideoFile, togglePublishStatus }