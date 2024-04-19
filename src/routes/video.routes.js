import { Router } from "express";
import { upload } from "../middlewares/multer.middlware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, getVideoById, publishAVideo, updateVideoDetails, updateVideoFile } from "../controllers/video.controllers.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/publish-video").post(verifyJWT, upload.fields(
    [
        {
            name: "thumbnail",
            maxCount: 1
        },
        {
            name: "video",
            maxCount: 1
        }
    ]
), publishAVideo)

router.route("/:videoId").get(verifyJWT, getVideoById)

router.route("/delete-video/:videoId").post(verifyJWT, deleteVideo);

router.route("/update-video-details/:videoId").patch(verifyJWT, updateVideoDetails);

router.route("/update-video/:videoId").patch(verifyJWT, upload.single("video"), updateVideoFile);


export default router