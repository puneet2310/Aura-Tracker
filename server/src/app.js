import express from "express"  //this syntax is known as module js works as unsynchronusly while comon Js works as synchronously
import cors from "cors"
import healthCheckRouter from "./routes/healthCheck.routes.js"
import userRouter from "./routes/user.routes.js"
import acadGoalsRoute from "./routes/acadGoals.routes.js"
import timeTableRouter from "./routes/timetable.routes.js"
import { errorHandler } from "./middlewares/error.middlewares.js"
import studentRouter from "./routes/student.routes.js"
import facultyRouter from "./routes/faculty.routes.js"
import attendanceRouter from "./routes/attendance.routes.js"
import classRepresentiveRouter from "./routes/classRepresentive.routes.js"
import assignmentRouter from "./routes/assignment.routes.js"
import getUserRouter from "./routes/getUsers.routes.js"
import messageRouter from "./routes/message.routes.js"
import chatGroupRouter from "./routes/chat-group.routes.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

dotenv.config({
    path: "./.env"
})

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
app.use("/api/v1/student", studentRouter)
app.use("/api/v1/faculty", facultyRouter)
app.use("/api/v1/acadGoals", acadGoalsRoute)
app.use("/api/v1/timetable", timeTableRouter)
app.use("/api/v1/attendance", attendanceRouter)
app.use("/api/v1/classRepresentative", classRepresentiveRouter)
app.use("/api/v1/assignment", assignmentRouter)
app.use("/api/v1/messages",messageRouter)
app.use("/api/v1/getUsers",getUserRouter)
app.use("/api/v1/chat-group",chatGroupRouter)

// app.use(errorHandler)

export { app }