import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios.helper';
import AttendanceTable from '../Attendance/AttendanceTable';

function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axiosInstance.get('/student/get-attendance');
        setAttendanceData(response.data.data);
      } catch (error) {
        console.log('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendanceData();
  }, []);

  if (loading) {
    return <p className="text-center text-indigo-500 animate-pulse">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 text-black rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Attendance Records</h2>
      <AttendanceTable attendanceData={attendanceData} />
    </div>
  );
}

export default AttendancePage;
