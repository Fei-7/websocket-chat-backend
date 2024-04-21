import express from "express";
import { getChatInfo, getChatMessages, getChatRooms } from "../controllers/groupChat";
import { protect } from "../middleware/auth";

const router = express.Router();

router.get("/", protect, getChatRooms);
router.get("/:chatRoomId", protect, getChatInfo);
router.get("/:chatRoomId/messages", protect, getChatMessages);

export default router;