import express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config()
// Connecting DB
connectDB();

const app=express()
const server = http.createServer(app)
const io= new Server(server, {
    cors:{
        origin:"http://localhost:5173"
    }
})
app.use(cors())
app.use(express.json())

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use(notFound);
app.use(errorHandler);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Y2ZjYjhkMjAwMWY1YTg3NjdmMDA0OCIsImlhdCI6MTc3NTIyNTc0MSwiZXhwIjoxNzc3ODE3NzQxfQ.KOFeBjJg0HJ0UydpXjD8Iso2D_vEWOrRxe5qM8mxrkY

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Y2ZjYjhkMjAwMWY1YTg3NjdmMDA0OCIsImlhdCI6MTc3NTIyNTg2NSwiZXhwIjoxNzc3ODE3ODY1fQ.LNGlQzldNcD9XnSUXbxmR1BxmaFjVRpYxn7xNPZEOYE

// 69cfcbcf2001f5a8767f004b