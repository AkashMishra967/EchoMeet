import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { connectToSocket } from "./controller/SocetManager.js";
import userRoutes from "./routes/UserRoutes.js";

dotenv.config(); 

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 8000));
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

const start = async () => {
    try {
        const connectionDb = await mongoose.connect(process.env.MONGODB_URI); 
        console.log(`MONGO Connected: ${connectionDb.connection.host}`);

        server.listen(app.get("port"), () => {
            console.log(`🚀 Server running on port ${app.get("port")}`);
        });

    } catch (e) {
        console.log(" Connection Failed:", e); 
    }
};

start();