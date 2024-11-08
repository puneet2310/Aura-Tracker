import e, { Router } from "express"
import { MarkAttendance, checkAttendanceExists } from '../controllers/attendance.controllers.js'
import { verifyJWT } from "../middlewares/auth.middlewares.js"
const router = Router()

router.route('/check-attendance-exists').post(verifyJWT, checkAttendanceExists)
router.route('/mark-attendance').post(verifyJWT, MarkAttendance)
// router.route('/get-attendance-records').get(verifyJWT, getAttendanceRecords)

export default router