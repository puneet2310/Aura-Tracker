import { Server } from 'socket.io'
import http from 'http'
import express from 'express'
import {app} from "./app.js"
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
})

const getRecieverSocketId = (receiverId) => {
    return userSocketMap[receiverId]
}

const userSocketMap = {}; //map to store user id with socket id

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // Emit online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Join a group
    socket.on("joinGroup", (groupId) => {
        console.log(`User ${userId} joined group ${groupId}`);
        socket.join(groupId); // Join the group room
    });

    // Leave a group
    socket.on("leaveGroup", (groupId) => {
        console.log(`User ${userId} left group ${groupId}`);
        socket.leave(groupId); // Leave the group room
    });

    // Disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});


export {io, app , server, getRecieverSocketId}