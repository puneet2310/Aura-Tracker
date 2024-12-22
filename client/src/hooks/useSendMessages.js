import { useState } from "react";
// import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { setSelectedConversation, setMessages } from "../store/conversationSlice";
import {useDispatch, useSelector} from "react-redux";
import axiosInstance from "../utils/axios.helper";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	const selectedConversation = useSelector((state) => state.conversation.selectedConversation);
	const messages = useSelector((state) => state.conversation.messages);


	const sendMessage = async (message) => {
		setLoading(true);
		// console.log("message",message)
		try {
			let response;
			if(selectedConversation?.fullName)response = await axiosInstance.post(`/messages/send/${selectedConversation._id}`, { message })
			if(selectedConversation?.name)response = await axiosInstance.post(`/messages/send-group/${selectedConversation._id}`, { message })
			// console.log("Response is: ",response)
			dispatch(setMessages([...messages, response.data.data]))

		} catch (error) {
			toast.error(error.message );
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;