import express from "express";
import {
  getChatInfo,
  getChatMessages,
  getChatRooms,
  createGroupChat,
  joinGroupChat,
} from "../controllers/groupChat";
import { protect } from "../middleware/auth";

const router = express.Router();

router.get("/", protect, getChatRooms);
router.get("/:chatRoomId", protect, getChatInfo);
router.get("/:chatRoomId/messages", protect, getChatMessages);

/**
 * TODO:
 * 1. Join group chat
 * 2. Create group chat
 */

router.post("/", protect, createGroupChat);
router.put("/:chatRoomId", protect, createGroupChat);

export default router;
