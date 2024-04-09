import { Router } from "express";
import { UpdateAvatar, changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateCoverImage } from "../controllers/user.controllers.js";
import {upload} from '../middlewares/multer.middlware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();


router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser);

router.route("/login").post(loginUser)

// Secured Routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)  

router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), UpdateAvatar)

router.route("/update-coverImage").patch(verifyJWT, upload.single("coverImage"), updateCoverImage)

export default router