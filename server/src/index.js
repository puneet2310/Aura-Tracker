// server/src/index.js
import dotenv from "dotenv"
import { server } from "./socket.js"
import connectDB from "./db/index.js"
import { redisClient } from "./db/redis.js"

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 3001

connectDB()
.then(() => {
    // Non-blocking Redis connection
    redisClient.connect()
        .then(() => console.log("✅ Redis Connected"))
        .catch((err) => console.log("⚠️ Redis connection failed (Falling back to DB):", err.message));

    server.listen(PORT, () => {
        console.log(`🚀 Server is running on ${PORT}`);
    })
})
.catch((err) => {
    console.log("❌ MONGO DB Connection error", err);
    process.exit(1); 
});