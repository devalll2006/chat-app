import express from "express";
import { body, param } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";
import {
  sendMessage,
  getMessages,
  getConversations,
} from "../controllers/messageController.js";

const router = express.Router();

// SEND MESSAGE
router.post(
  "/send",
  protect,
  [
    body("receiverId")
      .notEmpty()
      .withMessage("Receiver ID is required")
      .isMongoId()
      .withMessage("Invalid receiver ID"),

    body("content")
      .optional()
      .isString()
      .withMessage("Content must be a string")
      .isLength({ max: 2000 })
      .withMessage("Message too long"),

    body("image").optional().isURL().withMessage("Image must be a valid URL"),
  ],
  sendMessage,
);

router.get("/conversations", protect, getConversations);

// GET MESSAGES
router.get(
  "/:userId",
  protect,
  [param("userId").isMongoId().withMessage("Invalid user ID")],
  getMessages,
);

export default router;
