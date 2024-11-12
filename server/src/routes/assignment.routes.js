import { Router } from "express";
import { uploadAssignment } from "../controllers/assignment.controllers.js";
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

export default router;