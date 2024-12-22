import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios.helper";
import { extractTime } from "../../utils/extractTime";
import { useSelector } from "react-redux";


const Message = ({ message }) => {

	const [senderName, setSenderName] = useState(null);

  	const userData = useSelector((state) => state.auth.userData)
  	
	const selectedConversation = useSelector((state) => state.conversation.selectedConversation);
	const fromMe = message.senderId === userData._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? userData.avatar : selectedConversation?.avatar;
	const bubbleBgColor = fromMe ? "bg-indigo-500" : "";

	const shakeClass = message.shouldShake ? "shake" : "";


	useEffect(() => {
		const getSenderName = async () => {
			try {
				const res = await axiosInstance.get(`/getUsers/search/${message.senderId}`);
				console.log("Res: ", res)
				setSenderName(res.data.data.fullName);
	
			} catch (error) {
				console.log(error);
	
			}
		}
		getSenderName();
	}, [])

	return (
		<>
		 <div className={`chat ${chatClassName}`}>
		 	<div className='chat-image avatar'>
		 		<div className='w-10 rounded-full'>
		 			<img alt='Tailwind CSS chat bubble component' src={profilePic || `https://placehold.co/200x/${Math.random().toString(16).slice(2, 8)}/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato`} />
		 		</div>
		 	</div>
			 <div className="chat-header">
				{senderName}
			</div>
		 	<div className={`chat-bubble text-sm text-white ${bubbleBgColor} ${shakeClass} pb-2`}>{message.message}</div>
		 	<div className='chat-footer text-black opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
		 </div>
		</>
	);
};
export default Message;
