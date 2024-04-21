// this route is for testing

import express from "express";
import { protect } from "../middleware/auth";
import { uploadFile } from "../lib/file";
const multer = require("multer");
const upload = multer();
const router = express.Router();

// router.post("/", upload.single("file"), uploadFile); // for testing
router.post("/", protect, uploadFile);

export default router;
