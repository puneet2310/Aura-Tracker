import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axios.helper';
import { FaChevronDown, FaChevronUp, FaEdit, FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    username: '',
    email: '',
    role: 'Student',
    lastLogin: '',
    imageUrl: '',
  });
  const [academicGoals, setAcademicGoals] = useState([]);
  const [showGoals, setShowGoals] = useState(false);
  const [editField, setEditField] = useState(null);
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/users/current-user');
        const { fullName, email, userName, lastLogin, avatar } = response.data.data;
        setUserInfo((prev) => ({
          ...prev,
          fullName,
          username: userName,
          email,
          lastLogin: lastLogin ? new Date(lastLogin).toLocaleString() : 'Not available',
          imageUrl: avatar,
        }));
      } catch (error) {
        console.log('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchGoals = async () => {
      try {
        const response = await axiosInstance.get('/acadGoals/get-acad-goals');
        setAcademicGoals(response.data.data);
      } catch (error) {
        console.log('Error fetching academic goals:', error);
      }
    };

    if (authStatus) {
      fetchUserData();
      fetchGoals();
    }
  }, [authStatus]);

  const toggleGoals = () => {
    setShowGoals((prev) => !prev);
  };

  const handleEdit = (field) => {
    if (editField === field) {
      // Save the edited field (you would add API call here)
      setEditField(null);
    } else {
      setEditField(field);
    }
  };

  if (!authStatus) {
    return <p className="text-center text-gray-200">Please log in to view your dashboard.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Dashboard</h2>

      {loading ? (
        <p className="text-center text-gray-200 animate-pulse">Loading...</p>
      ) : (
        <>
          {/* User Profile Section */}
          <div className=" flex justify-center items-center bg-gray-700 p-6 rounded-lg shadow-md mb-6">
            <img
              src={userInfo.imageUrl}
              alt="User Profile"
              className="ml-9 w-24 h-24 rounded-full mr-6 shadow-lg"
            />
            <div className="space-y-2 w-full">
              {['fullName', 'username', 'email'].map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={userInfo[field]}
                    readOnly={editField !== field}
                    onChange={(e) =>
                      setUserInfo((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    className={`bg-gray-800 rounded-md px-3 py-2 w-1/2 border-b-2 border-gray-600 outline-none transition-colors duration-300 ${
                      editField === field ? 'border-blue-500' : 'cursor-text'
                    } ${editField === field ? 'text-white' : 'text-gray-400'}`}
                    style={{
                      cursor: editField === field ? 'text' : 'default',
                      caretColor: editField === field ? 'blue' : 'transparent',
                    }}
                  />
                  <button
                    onClick={() => handleEdit(field)}
                    className="text-gray-400 hover:text-blue-500"
                  >
                    {editField === field ? <FaSave /> : <FaEdit />}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
                  </button>
                </div>
              ))}
              <p className="text-gray-400">Role: {userInfo.role}</p>
              <p className="text-gray-400">Last Login: {userInfo.lastLogin}</p>
            </div>
          </div>

          {/* Academic Goals Section */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <h4 className="text-xl font-semibold">Academic Goals</h4>
              <button
                onClick={toggleGoals}
                className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                {showGoals ? <FaChevronUp className="mr-2" /> : <FaChevronDown className="mr-2" />}
                {showGoals ? 'Hide Goals' : 'Show Goals'}
              </button>
            </div>

            {showGoals && (
              <>
                <p className="text-gray-400 mt-4">Your academic goals help track your progress and keep you focused on your studies.</p>
                <div className="mt-4">
                  {academicGoals.length > 0 ? (
                    <ul className="space-y-4">
                      {academicGoals.map((goal, index) => (
                        <li
                          key={index}
                          className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-600 transition transform hover:-translate-y-1"
                        >
                          <h5 className="text-lg font-semibold">{goal.title}</h5>
                          <p className="text-gray-400 mt-1">{goal.description}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Due Date: {new Date(goal.targetDate).toLocaleDateString()}
                          </p>
                          <span
                            className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                              goal.isComplete ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                          >
                            {goal.isComplete ? 'Completed' : 'Pending'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 mt-4">No academic goals set yet.</p>
                  )}
                  <button
                    onClick={() => navigate('/all-acad-goals')}
                    className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 block mx-auto"
                  >
                    Edit Academic Goals
                  </button>
                  <button
                    onClick={() => navigate('/set-acad-goals')}
                    className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 block mx-auto"
                  >
                    Add Academic Goals
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
