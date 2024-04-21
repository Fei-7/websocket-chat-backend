import express from "express";
import { getChatInfo } from "../controllers/groupChat";
import { protect } from "../middleware/auth";

const router = express.Router();

router.get("/groupChat/:chatRoomId", protect, getChatInfo);

export default router;