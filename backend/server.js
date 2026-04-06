import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

//  Connect DB
connectDB();

const app = express();

//  Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

//  Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chat", chatRoutes);

//  Health route
app.get("/", (req, res) => {
  res.send("API is running...");
});

//  Error middleware
app.use(notFound);
app.use(errorHandler);

//  Create server
const server = http.createServer(app);

//  Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

//  SOCKET LOGIC (IMPORTANT)
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // setup user room
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // join chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("Joined room:", room);
  });

  // new message
  socket.on("new message", (newMessage) => {
    const chat = newMessage.chat;

    if (!chat.users) return;

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;

      socket.to(user._id).emit("message received", newMessage);
    });
  });

  // typing indicator
  socket.on("typing", (room) => socket.to(room).emit("typing"));
  socket.on("stop typing", (room) => socket.to(room).emit("stop typing"));

  socket.on("disconnect", () => {
    console.log(" User disconnected:", socket.id);
  });
});

//  Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});