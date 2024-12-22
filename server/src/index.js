import dotenv from "dotenv"
import { server} from "./socket.js"
import connectDB from "./db/index.js"

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 3001

connectDB()
.then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO DB Connection error", err)
});