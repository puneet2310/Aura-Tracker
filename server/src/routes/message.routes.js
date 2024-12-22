import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { sendMessage, getMessages, sendMessageInGroups, getMessagesOfGroup } from "../controllers/message.controllers.js";
import { getUsersBySearch } from "../controllers/getUsers.controllers.js";
const router = Router();

router.route("/get/:id").get(verifyJWT, getMessages);
router.route("/send/:id").post(verifyJWT, sendMessage);
router.route("/search").get(verifyJWT, getUsersBySearch);
router.route("/send-group/:groupId").post(verifyJWT, sendMessageInGroups);
router.route("/get-group/:groupId").get(verifyJWT, getMessagesOfGroup);

export default router