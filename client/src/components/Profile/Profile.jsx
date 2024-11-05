import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import axiosInstance from '../../utils/axios.helper';
import { useDispatch, useSelector } from 'react-redux';
import { login as authLogin } from '../../store/authSlice';

function Profile() {
    const [editField, setEditField] = useState(null);
    const [loading, setLoading] = useState(false); // Single loading state
    const userData = useSelector((state) => state.auth.userData);
    const [LocalUserInfo, setLocalUserInfo] = useState({
        fullName: '',
        userName: '',
        email: '',
        avatar: '',
        stream: '',
        regNo: '',
        semester: '',
        role: '',
        lastLogin: '',
    });

    const dispatch = useDispatch();

    useEffect(() => {
        if (userData) {
            setLocalUserInfo({
                fullName: userData.fullName,
                userName: userData.userName,
                email: userData.email,
                avatar: userData.avatar,
                stream: userData.stream,
                regNo: userData.regNo,
                semester: userData.semester,
                role: userData.role,
                lastLogin: userData.lastLogin,
            });
        }
    }, [userData]);

    const handleEdit = async (field) => {
        if (editField === field) {
            setLoading(true); // Start loading when saving
            try {
                const response = await axiosInstance.patch('/users/update-account-details', LocalUserInfo);
                console.log(response.data);
                dispatch(authLogin(response.data));
                setEditField(null);
            } catch (error) {
                console.error("Error updating user details:", error);
            } finally {
                setLoading(false); // Stop loading after save attempt
            }
        } else {
            setEditField(field); // Enable edit mode
        }
    };

    return (
        <div className="bg-indigo-200 p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-center items-center p-6 rounded-lg shadow-md mb-6">
                <img
                    src={LocalUserInfo.avatar || userData?.avatar}
                    alt="User Profile"
                    className="ml-9 w-24 h-24 rounded-full mr-6 shadow-lg"
                />
                <div className="space-y-2 w-full">
                    {['fullName', 'userName', 'email', 'regNo', 'semester', 'stream'].map((field) => (
                        <div key={field} className="flex items-center space-x-2">
                            <span className="text-indigo-600 font-semibold rounded-md px-3 py-2 ">
                                {field}:
                            </span>
                            <input
                                type="text"
                                value={LocalUserInfo[field]}
                                readOnly={editField !== field}
                                autoFocus={editField === field}
                                onChange={(e) =>
                                    setLocalUserInfo((prev) => ({ ...prev, [field]: e.target.value }))
                                }
                                className={`text-indigo-600 font-semibold bg-gray-100 rounded-md px-3 py-2 w-1/2 outline-none transition-all duration-300 ${
                                    editField === field
                                        ? 'border-indigo-600 text-gray-800'
                                        : 'border-transparent cursor-text text-gray-400'
                                }`}
                                style={{
                                    cursor: editField === field ? 'text' : 'default',
                                    borderBottom: '2px solid',
                                }}
                            />
                            <button
                                onClick={() => handleEdit(field)}
                                className="text-gray-500 hover:text-indigo-600"
                                disabled={loading} // Disable button while loading
                            >
                                {loading && editField === field ? 'Saving...' : editField === field ? <FaSave /> : <FaEdit />}
                            </button>
                        </div>
                    ))}
                    <div className="flex items-center space-x-2">
                        <span className="text-indigo-600 font-semibold rounded-md px-3 py-2 ">Role:</span>
                        {editField === 'role' ? (
                            <select
                                value={LocalUserInfo.role}
                                onChange={(e) =>
                                    setLocalUserInfo((prev) => ({ ...prev, role: e.target.value }))
                                }
                                className="text-indigo-600 font-semibold bg-gray-100 rounded-md px-3 py-2 w-1/2 outline-none border-indigo-600"
                            >
                                <option value="CR">CR</option>
                                <option value="Student">Student</option>
                                <option value="Faculty">Faculty</option>
                            </select>
                        ) : (
                            <span className="text-gray-600">{LocalUserInfo.role}</span>
                        )}
                        <button
                            onClick={() => handleEdit('role')}
                            className="text-gray-500 hover:text-indigo-600"
                            disabled={loading} // Disable button while loading
                        >
                            {loading && editField === 'role' ? 'Saving...' : editField === 'role' ? <FaSave /> : <FaEdit />}
                        </button>
                    </div>
                    <p className="text-gray-600">Last Login: {LocalUserInfo.lastLogin}</p>
                </div>
            </div>
        </div>
    );
}

export default Profile;
