import React, { useState } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import axiosInstance from '../../utils/axios.helper';
import { useDispatch, useSelector } from 'react-redux';
import { login as authLogin } from '../../store/authSlice';

function Profile({presentDays}) {
    const userData = useSelector((state) => state.auth.userData);
    // const userRole = userData.role;
    return (
        <div className="bg-indigo-200 p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-center items-center p-6 rounded-lg shadow-md mb-6">
                <img
                    src={userData.avatar}
                    alt="User Profile"
                    className="ml-9 w-24 h-24 rounded-full mr-6 shadow-lg"
                />
                <div className="space-y-2 w-full">
                    {['fullName', 'userName', 'email'].map((field) => (
                        <div key={field} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={userData[field]}
                                className={`text-indigo-600 font-semibold bg-gray-100 rounded-md px-3 py-2 w-1/2 outline-none transition-all duration-300 ${
                                    'border-transparent cursor-text text-gray-400'
                                }`}
                                style={{
                                    cursor: 'default',
                                    borderBottom: '2px solid',
                                }}
                            />
                        </div>
                    ))}
                    <p className="text-gray-600">Role: {userData.role}</p>
                    <p className="text-gray-600">Last Login: {userData.lastLogin}</p>
                </div>
            </div>
            { userData.role === 'Student' && (
                <div className='flex justify-center items-center gap-3'>  
                <div className="mt-4 p-4 bg-gray-200 rounded-lg text-center w-full max-w-60">
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">Academic Aura</h4>
                    <div className="flex justify-center items-center">     
                        <div className="relative">
                            <div
                                className="w-20 h-20 flex items-center justify-center text-2xl font-bold bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-full shadow-md"
                                title="Your academic aura reflects your learning progress and accomplishments"
                            >
                                {userData.acadAura}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 p-4 bg-gray-200 rounded-lg text-center w-full max-w-60">
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">Attendance Aura</h4>
                    <div className="flex justify-center items-center">     
                        <div className="relative">
                            <div
                                className="w-20 h-20 flex items-center justify-center text-2xl font-bold bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-full shadow-md"
                                title="Your academic aura reflects your learning progress and accomplishments"
                            >
                                {presentDays}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            )}
            
        </div>
    );
}

export default Profile;
// export  {userRole};
