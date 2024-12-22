import { setSocket, setOnlineUsers, disconnectSocket } from "./socketSlice";
import { setMessages } from "../store/conversationSlice";
import io from "socket.io-client";

// Function to initialize the socket connection
export const initializeSocket = (userId) => (dispatch, getState) => {
    if (!userId) {
        dispatch(disconnectSocket());
        return;
    }

    const socket = io("http://localhost:3008", {
        query: { userId },
    });

    // Save the socket instance in Redux store
    dispatch(setSocket(socket));

    // Listen for online users
    socket.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
    });


    // Clean up socket on disconnection
    socket.on("disconnect", () => {
        dispatch(disconnectSocket());
    });
};

// Function to clean up the socket connection
export const cleanupSocket = () => (dispatch, getState) => {
    const { socket } = getState().socket;
    if (socket) {
        socket.close(); // Disconnect the socket
        dispatch(disconnectSocket());
    }
};
