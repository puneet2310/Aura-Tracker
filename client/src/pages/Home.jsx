import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // useNavigate for cleaner navigation
import axiosInstance from '../utils/axios.helper';
import { Button } from '../components';
import { ArrowRightIcon } from '@heroicons/react/solid';

function Home() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState('');
  const [displayText, setDisplayText] = useState('');
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  // console.log('authStatus:', authStatus);
  // console.log('userData:', userData);

  const fullMessage =
    "Aura Tracker helps you manage tasks efficiently, keep track of your goals, and stay organized. Start by exploring your dashboard and setting up your tasks for the day!";

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {

        //You have 2 choices here to display the current user name
        // 1. Use the userData from the Redux store
        // 2. Use the userData from the backend response using controller getCurrentUser

              //Fist choice
        // const response = await axiosInstance.get('/users/current-user');
        // const { fullName } = response.data.data;
            
              //Second choice
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

  // useEffect(() => {
  //   if (!loading) {
  //     setDisplayText(''); 
  //     typeMessage();
  //   }
  // }, [loading, user]);

  // const typeMessage = () => {
  //   let index = 0;
  //   const typingInterval = setInterval(() => {
  //     if (index < fullMessage.length) {
  //       setDisplayText((prev) => prev + fullMessage[index]);
  //       index++;
  //     } else {
  //       clearInterval(typingInterval);
  //     }
  //   }, 50);

    // Cleanup interval on component unmount
    // return () => clearInterval(typingInterval);
  // };

  const handleDashboard = () => {
    navigate(authStatus ? '/dashboard' : '/login');
  };

  return (
    <div className="min-h-screen flex items-center text-center p-4">
      {loading ? (
        <p className="text-gray-200 animate-pulse">Loading...</p>
      ) : (
        <>
          <h2 className="text-5xl font-bold mb-4">
            Welcome <span className="font-extrabold">{user || 'You'}</span> to Aura Tracker
          </h2>
          <br />
          <div className="w-2/3">
            <p className="text-lg mb-6 mt-4">{fullMessage}</p>
            <div className="inline-block group">
              <Button
                label="Dashboard"
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center transition-all duration-300"
                onClick={handleDashboard}
              >
                Go to Dashboard
                <ArrowRightIcon className="h-5 w-5 ml-2 text-white transition-opacity duration-300 opacity-50 group-hover:opacity-100" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
