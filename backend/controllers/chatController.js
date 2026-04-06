import Chat from "../models/Chat.js";
import User from "../models/User.js";

// 👉 Create or access one-to-one chat
export const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "UserId is required" });
  }

  try {
    // Check if chat already exists
    let chat = await Chat.find({
      isGroupChat: false,
      users: {
        $all: [req.user._id, userId],
      },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    // Populate sender in latest message
    chat = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "name email",
    });

    if (chat.length > 0) {
      return res.json(chat[0]);
    }

    // Create new chat
    const newChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    });

    const fullChat = await Chat.findById(newChat._id)
      .populate("users", "-password");

    res.status(201).json(fullChat);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👉 Get all chats of logged-in user
export const fetchChats = async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name email",
    });

    res.json(chats);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};