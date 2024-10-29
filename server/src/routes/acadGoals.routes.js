import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { getAcadGoals, setAcadGoals } from "../controllers/acadGoals.controllers.js"

const router = Router()

router.route("/set-acad-goals").post(verifyJWT, setAcadGoals)
router.route('/get-acad-goals').get(verifyJWT, getAcadGoals)    

export default router