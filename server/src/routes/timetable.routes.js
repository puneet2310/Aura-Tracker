import express from 'express'
import { getTimetable } from '../controllers/timetable.contollers.js'
import { Router } from 'express'
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const router = Router()

router.route("/:stream/:semester").get(verifyJWT, getTimetable)

export default router
