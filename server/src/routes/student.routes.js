import { Router } from "express"
import { updateProfile , getProfile, getAttendance, getAssignments} from "../controllers/student.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
const router = Router()

router.route("/update-profile").patch(verifyJWT, updateProfile)
router.route("/get-profile").get(verifyJWT, getProfile)
router.route("/get-attendance").get(verifyJWT, getAttendance)
router.route("/get-assignments/:semester/:stream/:subject").get(verifyJWT, getAssignments)

export default router