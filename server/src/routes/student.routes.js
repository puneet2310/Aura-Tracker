import { Router } from "express"
import { updateProfile , getProfile, getAttendance} from "../controllers/student.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
const router = Router()

router.route("/update-profile").patch(verifyJWT, updateProfile)
router.route("/get-profile").get(verifyJWT, getProfile)
router.route("/get-attendance").get(verifyJWT, getAttendance)

export default router