import { Router } from "express";
import { getAssignments, uploadAssignment, submitAssignments, isSubmitted } from "../controllers/assignment.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/upload").post(verifyJWT,
    upload.fields([
        {
            name: "file",
            maxCount: 1
        }
    ]), 
    uploadAssignment);

router.route("/submit-assignment/:assignmentId").post(verifyJWT,
    upload.fields([
        {
            name: "file",
            maxCount: 1
        }
    ]),  submitAssignments)
        
router.route("/get-assignment/:stream/:semester/:subject").get(verifyJWT, getAssignments)
router.route("/is-assignment-submitted/:assignmentId").get(verifyJWT, isSubmitted)
export default router;