import express from "express"  //this syntax is known as module js works as unsynchronusly while comon Js works as synchronously
import cors from "cors"
import healthCheckRouter from "./routes/healthCheck.routes.js"
import userRouter from "./routes/user.routes.js"
import acadGoalsRoute from "./routes/acadGoals.routes.js"
import timeTableRouter from "./routes/timetable.routes.js"
import { errorHandler } from "./middlewares/error.middlewares.js"
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})
import cookieParser from "cookie-parser"

const app = express()
console.log("hello i am in backend",process.env.CORS_ORIGIN)
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)


app.use(express.json({limit: "16kb"}))

app.use(express.urlencoded({extended: true, limit: "16kb"}))

app.use(express.static("public"))

app.use(cookieParser())

//routes
app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/users",userRouter)
app.use("/api/v1/acadGoals", acadGoalsRoute)
app.use("/api/v1/timetable", timeTableRouter)

// app.use(errorHandler)

export { app }