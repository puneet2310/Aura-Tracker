import React, { useState } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import axiosInstance from '../../utils/axios.helper';
import { useDispatch } from 'react-redux';
import { login as authLogin } from '../../store/authSlice';
import { useSelector } from 'react-redux';
function Profile () {
    const [editField, setEditField] = useState(null);
    const userData = useSelector((state) => state.auth.userData);
    const [LocalUserInfo, setLocalUserInfo] = useState({
        fullName: userData?.fullName,
        userName: userData?.userName,
        email: userData?.email,
        avatar: userData?.avatar,
        stream: userData?.stream,
        regNo: userData?.regNo,
        semester: userData?.semester,
    });
    const dispatch = useDispatch();

    console.log("User Info", LocalUserInfo);

    const handleEdit = async (field) => {
        if (editField === field) {
            console.log("Saving changes...", LocalUserInfo);
            try {
                // Save the edited field
                const response = await axiosInstance.patch('/users/update-account-details', LocalUserInfo);
                console.log(response.data);

                dispatch(authLogin(response.data));

                setEditField(null);
            } catch (error) {
                console.error("Error updating user details:", error);
            }
        } else {
            // Enable editing mode for the selected field
            setEditField(field);
        }
    };

    return (
        <div className="bg-indigo-200 p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-center items-center p-6 rounded-lg shadow-md mb-6">
                <img
                    src={userData?.avatar}
                    alt="User Profile"
                    className="ml-9 w-24 h-24 rounded-full mr-6 shadow-lg"
                />
                <div className="space-y-2 w-full">
                    {['fullName', 'userName', 'email', 'regNo', 'semester', 'stream'].map((field) => (
                        <div key={field} className="flex items-center space-x-2">
                            <span className="text-indigo-600 font-semibold  rounded-md px-3 py-2 ">
                            {field}:
                            </span>
                            <input
                                type="text"
                                value={LocalUserInfo[field]} 
                                readOnly={editField !== field}
                                autoFocus={editField === field} // Adds focus when field is in edit mode
                                onChange={(e) =>
                                    setLocalUserInfo((prev) => ({ ...prev, [field]: e.target.value }))
                                }
                                className={`text-indigo-600 font-semibold bg-gray-100 rounded-md px-3 py-2 w-1/2 outline-none transition-all duration-300 ${
                                    editField === field ? 'border-indigo-600 text-gray-800' : 'border-transparent cursor-text text-gray-400'
                                }`}
                                style={{
                                    cursor: editField === field ? 'text' : 'default',
                                    borderBottom: '2px solid',
                                }}
                            />
                            <button
                                onClick={() => handleEdit(field)}
                                className="text-gray-500 hover:text-indigo-600"
                            >
                                {editField === field ? <FaSave /> : <FaEdit />}
                            </button>
                        </div>
                    ))}
                    <p className="text-gray-600">Role: {LocalUserInfo.role}</p>
                    <p className="text-gray-600">Last Login: {LocalUserInfo.lastLogin}</p>
                </div>
            </div>
            
        </div>
    );
}

export default Profile;
