import { useEffect } from "react";
import MessageInput from "./MessageInput";
import { TiMessages } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedConversation } from "../../store/conversationSlice";
import Messages from "./Messages";

const MessageContainer = () => {
	const dispatch = useDispatch();
	const selectedConversation = useSelector((state) => state.conversation.selectedConversation)

	useEffect(() => {
		// cleanup function (unmounts)
		return () => dispatch(setSelectedConversation(null));
	}, [setSelectedConversation]);


	return (
		<div className='md:min-w-[450px] flex flex-col'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className='bg-slate-500 px-4 py-2 mb-2 '>
						<span className='label-text'>To:</span>{" "}
						<span className='text-gray-900 font-bold'>{selectedConversation.fullName}</span>
					</div>
					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
    const userData = useSelector((state) => state.auth.userData);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 text-gray-600 text-center px-6 py-8">
			<p className="text-lg font-semibold">Welcome 👋 {userData.fullName} ❄</p>
			<p className="text-lg font-semibold">Select a chat to start messaging</p>
			<TiMessages className="text-gray-400 text-5xl mt-4" />
		</div>

    );
};


