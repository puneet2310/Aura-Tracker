import { Router } from 'express'
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { checkCRStatus, createClassRepresentive, getClassRepresentive } from '../controllers/classRepresentative.controllers.js'

const router = Router()
router.route('/create-class-representive').post(verifyJWT, createClassRepresentive)
router.route('/get-class-representive/:department/:semester').get(verifyJWT, getClassRepresentive)
router.route('/check-cr-status/:studentId').get(verifyJWT, checkCRStatus)

export default router