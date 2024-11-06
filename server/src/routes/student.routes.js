import { Router } from "express"
import { updateProfile , getProfile} from "../controllers/student.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
const router = Router()

router.route("/update-profile").patch(verifyJWT, updateProfile)
router.route("/get-profile").get(verifyJWT, getProfile)

export default router