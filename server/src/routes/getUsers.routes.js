import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/getUsers.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router();

router.route("/").get(verifyJWT,getAllUsers);
router.route("/search/:id").get(verifyJWT, getUserById);

export default router