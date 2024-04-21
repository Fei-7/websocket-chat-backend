import express from "express";
import { getChatInfo, getChatMessages } from "../controllers/groupChat";
import { protect } from "../middleware/auth";

const router = express.Router();

router.get("/groupChat/:chatRoomId", protect, getChatInfo);
router.get("/groupChat/:chatRoomId/messages", protect, getChatMessages);

export default router;