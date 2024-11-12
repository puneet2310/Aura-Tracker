import { Router } from "express";
import { getAssignments, uploadAssignment } from "../controllers/assignment.controllers.js";
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

router.route("/get-assignment/:stream/:semester/:subject").get(verifyJWT, getAssignments)
export default router;