import express from 'express'
import { getTimetable, editTimeTable } from '../controllers/timetable.contollers.js'
import { Router } from 'express'
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const router = Router()

router.route("/:stream/:semester").get(verifyJWT, getTimetable)
router.route("/edit/:stream/:semester").post(verifyJWT, editTimeTable)
export default router
