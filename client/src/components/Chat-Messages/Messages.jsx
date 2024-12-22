import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../utils/axios.helper";
import { setMessages } from "../../store/conversationSlice";
import toast from "react-hot-toast";
import MessageSkeleton from "../Skeltons/MessageSkeltons";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
  const dispatch = useDispatch();
  const { selectedConversation, messages } = useSelector((state) => state.conversation);
  useListenMessages();
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef(null);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        console.log("Fetching messages...");
        let res;
				if(selectedConversation?.fullName) res = await axiosInstance.get(`/messages/get/${selectedConversation._id}`);
				else if(selectedConversation?.name) res = await axiosInstance.get(`/messages/get-group/${selectedConversation._id}`);

        dispatch(setMessages(res.data)); // Update Redux state
        console.log("Messages fetched:", res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch messages");
        dispatch(setMessages([]));
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) {
      getMessages();
    }
  }, [selectedConversation?._id, dispatch]);

  // Scroll to the bottom of the message container when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      // Use setTimeout to ensure the DOM updates before scrolling
      setTimeout(() => {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }, 100); 
    }
  }, [messages]);

  return (
    <div
      ref={messagesContainerRef}
      className="px-4 flex-1 overflow-auto custom-scrollbar"
      style={{ maxHeight: 'calc(100vh - 80px)' }}
    >
      {/* Render messages */}
      {!loading && messages?.length > 0 &&
        messages.map((message) => (
          <div key={message._id}>
            <Message message={message} />
          </div>
        ))}

      {/* Render skeletons when loading */}
      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

      {/* Show placeholder text when no messages */}
      {!loading && messages?.length === 0 && (
        <p className="text-center">Send a message to start the conversation</p>
      )}
    </div>
  );
};

export default Messages;
