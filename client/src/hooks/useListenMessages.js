import { useEffect } from "react";
import { setMessages } from "../store/conversationSlice";
import { useDispatch, useSelector } from "react-redux";

const useListenMessages = () => {
    const socket = useSelector((state) => state.socket.socket);
    const messages = useSelector((state) => state.conversation.messages);
    const selectedConversation = useSelector((state) => state.conversation.selectedConversation);

    console.log("selectedConversation", selectedConversation);

    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedConversation?.name) {
            console.log("Joining group...");
            socket?.emit("joinGroup", selectedConversation._id);
        }

        console.log("socket", socket);

        socket?.on("newMessage", (newMessage) => {
            console.log("newMessage", newMessage);

            // Create a copy before modifying
            const updatedMessage = { ...newMessage, shouldShake: true };

            console.log("Size of the messages: ", messages.length);
            if (selectedConversation._id === newMessage.senderId) {
                dispatch(setMessages([...messages, updatedMessage]));
            }
        });

        socket?.on("newGroupMessage", ({ newMessage, groupId }) => {
            console.log("newGroupMessage", newMessage, groupId);

            // Create a copy before modifying
            const updatedMessage = { ...newMessage, shouldShake: true };

            console.log("Size of the messages: ", messages.length);
            if (selectedConversation.name && selectedConversation._id === groupId) {
                dispatch(setMessages([...messages, updatedMessage]));
            }
        });

        return () => {
            socket?.off("newMessage");
            socket?.off("newGroupMessage");
        };
    }, [socket, messages, selectedConversation, dispatch]);

    return null;
};

export default useListenMessages;
