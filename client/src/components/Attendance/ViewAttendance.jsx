import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios.helper';
import AttendanceTable from '../Attendance/AttendanceTable';
import { FaSpinner } from 'react-icons/fa';

function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const subjects = ['Analysis of Algorithms', 'OOPs']

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axiosInstance.get('/student/get-attendance');
        setAttendanceData(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.log('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendanceData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center mt-8 min-h-screen">
          <FaSpinner className="animate-spin text-indigo-600 text-3xl" /> 
          <p className='mt-4'>Please wait while loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 text-black rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Attendance Records</h2>
      <AttendanceTable attendanceData={attendanceData} subjects={subjects}/>
    </div>
  );
}

export default AttendancePage;
