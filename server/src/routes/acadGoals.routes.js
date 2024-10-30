import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { getAcadGoals, setAcadGoals, updateAcadGoal, deleteAcadGoal } from "../controllers/acadGoals.controllers.js"

const router = Router()

router.route("/set-acad-goals").post(verifyJWT, setAcadGoals)
router.route('/get-acad-goals').get(verifyJWT, getAcadGoals)   
router.route('/update-acad-goal').put(verifyJWT, updateAcadGoal)
router.route('/delete-acad-goal').delete(verifyJWT, deleteAcadGoal)

export default router