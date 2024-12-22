import { useState } from 'react';
import Conversations from '../Chat-Sidebar/Conversations';
import MessageContainer from '../Chat-Messages/MessageContainer';
import CreateGroupModal from '../Chat-Sidebar/CreateGroupModal';

const ChatUI = () => {
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-300">
        {/* Sidebar Header */}
        <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white">
          <h1 className="text-xl font-semibold">Chat Web</h1>
          <button
            className="bg-indigo-700 hover:bg-indigo-800 text-white px-3 py-1 rounded-md text-sm"
            onClick={() => setShowCreateGroupModal(true)}
          >
            Create Group
          </button>
        </header>

        {/* Conversation List */}
        <Conversations />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-auto">
        {/* Chat Header */}
        <MessageContainer />
      </div>

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <CreateGroupModal onClose={() => setShowCreateGroupModal(false)} />
      )}
    </div>
  );
};

export default ChatUI;
