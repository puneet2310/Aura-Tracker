import { useSelector, useDispatch } from "react-redux";
import { setSelectedConversation } from "../../store/conversationSlice";

const Conversation = ({ conversation, lastIdx }) => {
    const selectedConversation = useSelector((state) => state.conversation.selectedConversation);
    const dispatch = useDispatch();

    const onlineUsers = useSelector((state) => state.socket.onlineUsers);
    const isSelected = selectedConversation?._id === conversation._id;
    const isOnline = onlineUsers.includes(conversation._id);

    return (
        <>
            <div
                key={conversation._id}
                className={`flex items-center mb-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md ${
                    isSelected ? "bg-gray-200" : ""} ${lastIdx ? "mb-24" : ""}`}
                onClick={() => dispatch(setSelectedConversation(conversation))}
            >
                {conversation.fullName && (
                    <div
                        className={`w-10 h-10 bg-gray-300 rounded-full mr-2 avatar ${
                            isOnline ? "online" : ""
                        }`}
                    >
                        <img
                            src={
                                conversation.avatar ||
                                `https://placehold.co/200x/${Math.random()
                                    .toString(16)
                                    .slice(2, 8)}/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato`
                            }
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full"
                        />
                    </div>
                )}

                {conversation.name && (
                    <div className="avatar-group -space-x-6 rtl:space-x-reverse mr-3">
                        <div className="avatar">
                            <div className="w-10">
                                <img
                                    src={
                                        conversation.members[0].avatar ||
                                        `https://placehold.co/200x/${Math.random()
                                            .toString(16)
                                            .slice(2, 8)}/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato`
                                    }
                                />
                            </div>
                        </div>
                        <div className="avatar">
                            <div className="w-10">
                                <img
                                    src={
                                        conversation.members[1].avatar ||
                                        `https://placehold.co/200x/${Math.random()
                                            .toString(16)
                                            .slice(2, 8)}/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato`
                                    }
                                />
                            </div>
                        </div>
                        {conversation.members.length > 2 && (
                            <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content w-10">
                                    <span>+{conversation.members.length - 2}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex-1">
                    <h2 className="text-sm font-semibold">
                        {conversation.fullName || conversation.name}
                    </h2>
                    <p className="text-xs text-gray-600">This is a sample message.</p>
                </div>
            </div>

            {/* Add spacing for the last conversation */}
            {!lastIdx && <div className="divider my-0 py-0 h-1" />}
            {lastIdx && <div className="h-4" />} {/* Spacer for the last conversation */}
        </>
    );
};

export default Conversation;
