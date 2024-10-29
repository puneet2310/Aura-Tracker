import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axios.helper';

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    username: '',
    email: '',
    role: 'Student',  // Assuming a default role of "Student" here
    lastLogin: ''
  });
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/users/current-user');
        const { fullName, email, userName, lastLogin } = response.data.data;
        
        setUserInfo({
          fullName: fullName,
          username: userName,
          email: email,
          role: 'Student', // Set role here or use value from API if available
          lastLogin: lastLogin ? new Date(lastLogin).toLocaleString() : 'Not available'
        });
        
      } catch (error) {
        console.log('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authStatus) {
      fetchUserData();
    }
  }, [authStatus]);

  return (
    <div className="max-w-lg mx-auto my-8 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">User Dashboard</h2>

      {loading ? (
        <p className="text-center text-gray-200 animate-pulse">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 rounded-lg shadow-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-200 uppercase bg-gray-900">Field</th>
                <th className="px-4 py-2 text-left font-medium text-gray-200 uppercase bg-gray-900">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-600">
                <td className="px-4 py-3 text-gray-300">Full Name</td>
                <td className="px-4 py-3">{userInfo.fullName || 'N/A'}</td>
              </tr>
              <tr className="border-b border-gray-600">
                <td className="px-4 py-3 text-gray-300">Username</td>
                <td className="px-4 py-3">{userInfo.username || 'N/A'}</td>
              </tr>
              <tr className="border-b border-gray-600">
                <td className="px-4 py-3 text-gray-300">Email</td>
                <td className="px-4 py-3">{userInfo.email || 'N/A'}</td>
              </tr>
              <tr className="border-b border-gray-600">
                <td className="px-4 py-3 text-gray-300">Role</td>
                <td className="px-4 py-3">{userInfo.role}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-300">Last Login</td>
                <td className="px-4 py-3">{userInfo.lastLogin}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
