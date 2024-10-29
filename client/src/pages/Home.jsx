import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';
import { ArrowRightIcon } from '@heroicons/react/solid';

function Home() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState('');
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  const fullMessage =
    "Aura Tracker helps you manage tasks efficiently, keep track of your goals, and stay organized. Start by exploring your dashboard and setting up your tasks for the day!";

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        setUser(userData.fullName);
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

  const handleDashboard = () => {
    navigate(authStatus ? '/dashboard' : '/login');
  };
  const handleAcademicGoals = () => {
    navigate(authStatus ? '/all-acad-goals' : '/login');
  };

  return (
    <div className="min-h-screen  items-center justify-start p-8 text-center space-y-12">
      {loading ? (
        <p className="text-gray-200 animate-pulse">Loading...</p>
      ) : (
        <>
          {/* Welcome Section */}
          <div className=" w-full flex flex-col items-center space-y-4 mt-24">
            <h2 className="text-5xl font-bold">
              Welcome <span className="font-extrabold">{user || 'You'}</span> to Aura Tracker
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl">{fullMessage}</p>
            <Button
              label="Dashboard"
              className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-full flex items-center justify-center mt-4 transition-all duration-300"
              onClick={handleDashboard}
            >
              Go to Dashboard
              <ArrowRightIcon className="h-5 w-5 ml-2 text-white transition-opacity duration-300 opacity-50 group-hover:opacity-100" />
            </Button>
          </div>

          {/* Spacer to push the academic goals section further down */}
          <div className="min-h-20 w-full"></div>

          {/* Academic Goals Section */}
          <div className=' flex items-center justify-center'>
            <div className="w-1/2 p-6 shadow-lg rounded-lg text-left">
              <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">Set Your Academic Goals</h2>
              <p className="text-center text-gray-600 mb-4">
                Achieve your potential by setting clear academic goals. Track your progress, stay focused, and reach
                new heights!
              </p>
              {authStatus ? (
                <Button
                  label="Academic Goals"
                  className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-full flex items-center justify-center mt-4 transition-all duration-300"
                  onClick={handleAcademicGoals}
                >
                  Go to Academic Goals
                  <ArrowRightIcon className="h-5 w-5 ml-2 text-white transition-opacity duration-300 opacity-50 group-hover:opacity-100" />
                </Button>
              ) : (
                <p className="text-sm italic text-gray-500">
                  Log in to start setting and tracking your academic goals.
                </p>
              )}
            </div>

            {/* Academic Goals Section */}
            <div className="w-1/2 p-6 shadow-lg rounded-lg text-left">
              <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">Set Your Academic Goals</h2>
              <p className="text-center text-gray-600 mb-4">
                Achieve your potential by setting clear academic goals. Track your progress, stay focused, and reach
                new heights!
              </p>
              {authStatus ? (
                <Button
                  label="Academic Goals"
                  className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-full flex items-center justify-center mt-4 transition-all duration-300"
                  onClick={handleAcademicGoals}
                >
                  Go to Academic Goals
                  <ArrowRightIcon className="h-5 w-5 ml-2 text-white transition-opacity duration-300 opacity-50 group-hover:opacity-100" />
                </Button>
              ) : (
                <p className="text-sm italic text-gray-500">
                  Log in to start setting and tracking your academic goals.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
