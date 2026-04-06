import express from "express";
import { accessChat, fetchChats } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create or access chat
router.post("/", protect, accessChat);

// Get all chats
router.get("/", protect, fetchChats);

export default router;