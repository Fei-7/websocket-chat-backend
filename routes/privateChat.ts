import express from "express";
import { getChatInfo, getChatMessages } from "../controllers/privateChat";
import { protect } from "../middleware/auth";

const router = express.Router();

router.get("/privateChat/:userId", protect, getChatInfo);
router.get("/privateChat/:userId/messages", protect, getChatMessages);

export default router;