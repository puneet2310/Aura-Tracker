
import { Router } from "express"
import { 
        registerUser,
        loginUser,
        logoutUser,
        changeCurrentPassword,
        updateAccountDetails,
        updateUserAvatar,
        refreshAccessToken,
        getCurrentUser,
        googleLogin,
        calculateAcadAura,
        leaderboard
        } 
        from "../controllers/user.controllers.js"
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const router = Router()
// unsecured routes --> accessed by all users , not worry about for verifyJWT middleware

router.route("/register").post( upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }, {
        name: "coverImage",
        maxCount: 1
    }
]) , registerUser)

router.route("/login").post(loginUser)
router.route("/google").get(googleLogin)
router.route("/refresh-token").post(refreshAccessToken)

router.route("/get-top-users").get(leaderboard)

//secured routes

router.route("/logout").post(verifyJWT, logoutUser)

router.route("/update-password").post(verifyJWT,changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account-details").patch(verifyJWT, updateAccountDetails)

router.route("/update-avatar").patch(verifyJWT , upload.single("avatar"), updateUserAvatar)
router.route("/get-acad-aura").get(verifyJWT, calculateAcadAura)

export default router