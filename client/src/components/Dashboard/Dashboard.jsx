import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axios.helper';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';
import AcademicGoals from './AcademicGoals';
import Button from '../Button';

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [academicGoals, setAcademicGoals] = useState([]);
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axiosInstance.get('/acadGoals/get-acad-goals');
        setAcademicGoals(response.data.data);

        const res1 = await axiosInstance.get('/student/get-attendance');
        console.log('Attendance response:', res1.data);
      } catch (error) {
        console.log('Error fetching academic goals:', error);
      }
    };

    if (authStatus) {
      fetchGoals();
    }
  }, [authStatus]);

  const handleUpdateUserInfo = (updatedUserInfo) => {
    setUserInfo(updatedUserInfo);
  };

  if (!authStatus) {
    return <p className="text-center text-gray-200">Please log in to view your dashboard.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 text-black rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Dashboard</h2>

      {loading ? (
        <p className="text-center text-indigo-500 animate-pulse">Loading...</p>
      ) : (
        <>
          {/* User Profile Section */}
          <Profile />

          {/* Conditional Rendering for Student Role */}
          {userData.role === 'Student' && (
            <AcademicGoals
              academicGoals={academicGoals}
              onUpdateUserInfo={handleUpdateUserInfo}
            />
          )}

          {/* Conditional Rendering for Faculty Role with Button to View Students */}
          {userData.role === 'Faculty' && (
            <div className='flex flex-col items-center'>
              <Button
                onClick={() => navigate('/students')}
                className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-800 transition duration-300 block mx-auto"
              >
                View Student List
              </Button>
              <Button
                onClick={() => navigate('/faculty/take-attendance')}
                className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-800 transition duration-300 block mx-auto"
              >
                Take Today's Attendance
              </Button>
            </div>
          )}

          {/* Timetable Button for Students */}
          {userData.role === 'Student' && (
            <Button
              onClick={() => navigate('/timetable')}
              className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300 block mx-auto"
            >
              See Your Timetable
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
