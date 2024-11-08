import { Router } from "express"
import {updateProfile, getProfile, getStudentsList} from '../controllers/faculty.controllers.js'
import { verifyJWT } from "../middlewares/auth.middlewares.js"
const router = Router()

router.route('/update-profile').patch(verifyJWT, updateProfile)
router.route('/get-profile').get(verifyJWT, getProfile)
router.route('/get-students-list/:department').get(verifyJWT, getStudentsList)

export default router