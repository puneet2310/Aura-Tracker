import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { createChatGroup, getChatGroups, addMembers, removeMembers } from "../controllers/chat-group.controllers.js"

const router = Router()

router.route("/create").post(verifyJWT, createChatGroup)
router.route("/get").get(verifyJWT, getChatGroups)
router.route("/addMembers/:groupId").post(verifyJWT, addMembers)
router.route("/removeMembers/:groupId").post(verifyJWT, removeMembers)

export default router