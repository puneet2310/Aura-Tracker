// Dashboard.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axios.helper';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';
import AcademicGoals from './AcademicGoals';
import Button from '../Button';
import AttendanceTable from '../Attendance/AttendanceTable';

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [academicGoals, setAcademicGoals] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [totalPresent, setTotalPresent] = useState(0);
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch academic goals
        const goalsResponse = await axiosInstance.get('/acadGoals/get-acad-goals');
        setAcademicGoals(goalsResponse.data.data);

        // Fetch attendance data
        const attendanceResponse = await axiosInstance.get('/student/get-attendance');
        console.log("Attendance Response:", attendanceResponse.data.data);
        setAttendanceData(attendanceResponse.data.data);
      } catch (error) {
        console.log('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authStatus) {
      fetchData();
    }
  }, [authStatus]);

  useEffect(() => {
    // Calculate total present whenever attendanceData changes
    const presentDays = attendanceData.filter(record => record.status === 'Present').length;
    console.log("Total Present:", presentDays);
    setTotalPresent(presentDays);
  }, [attendanceData]);

  const handleSubjectSelection = (subject) => {
    setSelectedSubject(subject);
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
          <Profile presentDays={totalPresent} />

          {/* Conditional Rendering for Student Role */}
          {userData.role === 'Student' && (
            <>
              <AcademicGoals academicGoals={academicGoals} />
              
            </>
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
              <Button
                onClick={() => navigate('/faculty/upload-assignment')}
                className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-800 transition duration-300 block mx-auto"
              >
                Upload Assignment
              </Button>
            </div>
          )}

          {/* Timetable Button for Students */}
          {userData.role === 'Student' && (
            <div className='flex flex-col items-center'>
              <Button
                onClick={() => navigate('/attendance')}
                className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300"
              >
                View Attendance
              </Button>
              <Button
                onClick={() => navigate('/timetable')}
                className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300 block mx-auto"
              >
                See Your Timetable
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
