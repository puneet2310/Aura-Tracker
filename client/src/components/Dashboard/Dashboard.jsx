import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axios.helper';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';
import AcademicGoals from './AcademicGoals';
import Button from '../Button';
function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    userName: '',
    email: '',
    role: 'Student',
    lastLogin: '',
    imageUrl: '',
  });
  const [academicGoals, setAcademicGoals] = useState([]);
  const [academicAura, setAcademicAura] = useState(0);
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
          userName: userName,
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

    const fetchAcadAura = async () => {
      try {
        const respone = await axiosInstance.get('/users/get-acad-aura');
        const academicAura = respone.data.data;
        setAcademicAura(academicAura);
        // console.log("Fetch Acadaura is : ",respone.data.data);

      } catch (error) {
        console.log('Error fetching academic aura:', error);
      }
    }

    if (authStatus) {
      fetchUserData();
      fetchGoals();
      fetchAcadAura();
    }
  }, [authStatus]);

  const handleUpdateUserInfo = ((updatedUserInfo) => {
    setUserInfo(updatedUserInfo)
  })


  if (!authStatus) {
    return <p className="text-center text-gray-200">Please log in to view your dashboard.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 text-black rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Dashboard</h2>

      {loading ? (
        <p className="text-center text-gray-200 animate-pulse">Loading...</p>
      ) : (
        <>
          {/* User Profile Section */}
            <Profile userInfo={userInfo} academicAura={academicAura} />

          {/* Academic Goals Section */}
            <AcademicGoals 
            academicGoals={academicGoals}
            onUpdateUserInfo={handleUpdateUserInfo} 
            />

            <Button
                onClick={() => navigate('/timetable')}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300 block mx-auto"
            >
                See Your Timetable
            </Button>  
        </>
      )}
    </div>
  );
}

export default Dashboard;