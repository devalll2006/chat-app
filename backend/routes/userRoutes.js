import express from "express";
import { getUsers, createUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/", getUsers);
router.get("/", protect, getUsers);
router.post("/", createUser);

export default router;