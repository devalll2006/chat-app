import Message from "../models/Message.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

// SEND MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { content, receiverId, image } = req.body;

    if (!content?.trim() && !image) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot message yourself",
      });
    }

    const receiverExists = await User.exists({ _id: receiverId });

    if (!receiverExists) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content: content?.trim() || "",
      image: image || "",
      status: "sent",
    });

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// GET MESSAGES
export const getMessages = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// GET CONVERSATIONS
export const getConversations = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $addFields: {
          otherUser: {
            $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"],
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$otherUser",
          lastMessage: { $first: "$content" },
          lastMessageTime: { $first: "$createdAt" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
          },
          lastMessage: 1,
          lastMessageTime: 1,
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
