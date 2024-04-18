import { Router } from "express";
import { upload } from "../middlewares/multer.middlware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getVideoById, publishAVideo, updateVideo } from "../controllers/video.controllers.js";

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

router.route("/update-video").patch(verifyJWT, upload.fields(
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
), updateVideo)

export default router