import { useEffect, useRef } from "react";
import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";

const Conversations = () => {
    const { loading, conversations } = useGetConversations();
    const containerRef = useRef(null);

    return (
        <div
            ref={containerRef}
            className="flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-gray-200 scrollbar-thumb-gray-500"
        >
            {conversations.map((conversation, idx) => (
                <Conversation
                    key={conversation._id}
                    conversation={conversation}
                    lastIdx={idx === conversations.length - 1}
                />
            ))}

            {loading && (
                <div className="flex justify-center items-center py-4">
                    <span className="loading loading-spinner"></span>
                </div>
            )}
        </div>
    );
};

export default Conversations;
