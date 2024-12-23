import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios.helper";
import { useSelector } from "react-redux";
import { AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineCheckCircle } from "react-icons/ai";
import { BiLoaderCircle } from "react-icons/bi";
import { toast } from "react-toastify";

const CreateGroupModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const userData = useSelector((state) => state.auth.userData);

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/getUsers`);
        const users = response.data.data
        const filtered = users.filter((user) => user.fullName != null)

        setAllUsers(filtered);
        setFilteredUsers(filtered); // Initially, show all users
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Update filtered users on search query change
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter((user) =>
        user?.fullName?.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, allUsers]);
  

  // Add a member
  const handleAddMember = (user) => {
    if (!selectedMembers.some((member) => member._id === user._id)) {
      setSelectedMembers((prev) => [...prev, user]);
    }
  };

  // Remove a member
  const handleRemoveMember = (userId) => {
    setSelectedMembers((prev) => prev.filter((member) => member._id !== userId));
  };

  // Create Group
  const handleCreateGroup = async () => {
    const members = selectedMembers.map((member) => member._id);
    members.push(userData._id);
    console.log("Group Created:", {
      groupName,
      members,
    });

    try {
      const response = await axiosInstance.post("/chat-group/create", { groupName, members });
      console.log("Response from creating group: ", response);
      toast.success("Group created successfully");  
    } catch (error) {
      console.error("Error creating group:", error);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-auto">
        <h2 className="text-lg font-semibold mb-4">Create Group</h2>

        {/* Group Name Input */}
        <input
          type="text"
          placeholder="Group Name"
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search Members"
          className="w-full border border-gray-300 rounded-md p-2 mb-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* User List */}
        <div className="border border-gray-300 rounded-md max-h-40 overflow-auto p-2 mb-4">
          {loading ? (
            <div className="flex justify-center items-center">
              <BiLoaderCircle className="animate-spin text-indigo-600 text-2xl" />
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center p-2 border-b last:border-none"
              >
                <span className="text-sm">{user.fullName}</span>
                {selectedMembers.some((member) => member._id === user._id) ? (
                  <AiOutlineCheckCircle className="text-green-500 text-xl" />
                ) : (
                  <button onClick={() => handleAddMember(user)}>
                    <AiOutlineUserAdd className="text-indigo-600 text-xl hover:text-indigo-800" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Selected Members */}
        <div className="border border-gray-300 rounded-md p-2 mb-4 max-h-40 overflow-auto">
          <h3 className="text-sm font-semibold mb-2">Selected Members:</h3>
          {selectedMembers.length === 0 ? (
            <p className="text-gray-500 text-sm">No members selected.</p>
          ) : (
            selectedMembers.map((member) => (
              <div
                key={member._id}
                className="flex justify-between items-center p-2 border-b last:border-none"
              >
                <span className="text-sm">{member.fullName}</span>
                <button onClick={() => handleRemoveMember(member._id)}>
                  <AiOutlineUserDelete className="text-red-500 text-xl hover:text-red-700" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-300 px-3 py-1 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-3 py-1 rounded-md ${
              !groupName || selectedMembers.length === 0
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 text-white"
            }`}
            onClick={handleCreateGroup}
            disabled={!groupName || selectedMembers.length === 0}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
