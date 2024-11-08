import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';
import { ArrowRightIcon } from '@heroicons/react/solid';
import axiosInstance from '../utils/axios.helper';
import AcadLeaderBoard from '../components/LeaderBoard/AcadLeaderBoard';

function Home() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState('');
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // console.log('userData on home page: ', userData);  

  const fullMessage =
    "Pro-Track helps you manage tasks efficiently, keep track of your goals, and stay organized. Start by exploring your dashboard and setting up your tasks for the day!";

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/faculty/get-profile');
        console.log("Response from ", response)
        setUser(userData.fullName);

        // Fetch all goals

      } catch (error) {
        console.log('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authStatus) {
      fetchUserData();
    }
  }, [authStatus, userData]);


  const handleDashboard = () => {
    navigate(authStatus ? '/dashboard' : '/login');
  };

  const handleAcademicGoals = () => {
    navigate(authStatus ? '/all-acad-goals' : '/login');
  };

  return (
    <div className="min-h-screen  items-start p-8 text-center bg-gray-100">
      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading...</p>
      ) : (
        <>
          {/* Left Side Content */}
          <div className="flex-1 flex flex-col items-center justify-start space-y-12 md:pr-8">

            {/* Welcome Section */}
            <div className="flex flex-col items-center space-y-4 mt-12">
              <h2 className="text-5xl font-bold text-gray-800">
                Welcome <span className="font-extrabold text-indigo-600">{user || 'You'}</span> to Pro-Track!
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl">{fullMessage}</p>
              <Button
                label="Dashboard"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full flex items-center justify-center mt-4 transition-all duration-300"
                onClick={handleDashboard}
              >
                Go to Dashboard
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Button>
            </div>

            {/* Academic Goals Card */}
            { userData?.role === 'Student' && (
                <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl text-left">
                <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">Set Your Academic Goals</h2>
                <p className="text-center text-gray-600 mb-4">
                  Achieve your potential by setting clear academic goals. Track your progress, stay focused, and reach new heights!
                </p>
                {authStatus ? (
                  <div className="flex justify-center">
                    <Button
                      label="Academic Goals"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full flex items-center justify-center mt-4 transition-all duration-300"
                      onClick={handleAcademicGoals}
                    >
                      Go to Academic Goals
                      <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm italic text-gray-500 text-center">
                    Log in to start setting and tracking your academic goals.
                  </p>
                )}
              </div>
            )}

          </div>

          {/* Leaderboard */}
          <h2 className="mt-16 text-2xl font-bold text-gray-800 text-center mb-4">Leaderboard</h2>
          <div className="flex justify-center items-center">
            <div className="w-full md:w-2/3 lg:w-1/2 mt-8">
              <div className="bg-white shadow-lg rounded-lg p-10"> {/* Increased padding for a wider look */}
                {authStatus ? (
                  <AcadLeaderBoard />
                ) : (
                  <p className="text-base italic text-gray-500 text-center"> {/* Slightly larger font size */}
                    Log in to view the leaderboard.
                  </p>
                )}
              </div>
            </div>
          </div>

        </>
      )}
    </div>
  );
}

export default Home;
