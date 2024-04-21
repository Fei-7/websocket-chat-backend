import express from "express";
import { getChatInfo } from "../controllers/privateChat";
import { protect } from "../middleware/auth";

const router = express.Router();

router.get("/privateChat/:userId", protect, getChatInfo);

export default router;