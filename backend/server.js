import express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import { connectDB } from "./config/db.js";


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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});