import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios.helper';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { openNotification } from '../Notification/antd';

function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const userData = useSelector((state) => state.auth.userData);
  console.log(userData)

  const subjects = ['Analysis of Algorithms', 'Automata', 'OOPs']
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8]; // Add any semesters you want here

  useEffect(() => {
    console.log("Attendance state has changed:", attendance);
  }, [attendance]);

  const fetchStudents = async () => {
    if (!selectedSubject || !selectedSemester) return;

    setLoading(true);
    try {
      const response1 = await axiosInstance.get('/faculty/get-profile');
      console.log(response1);

      const department = response1.data.data.faculty.department;
      const response = await axiosInstance.get(`/faculty/get-students-list/${department}/${selectedSemester}`);
      console.log(response);
      setStudents(response.data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    console.log(studentId, status);
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
    console.log(attendance);
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const submitAttendance = async () => {
    if (!selectedSubject) {
      Swal.fire({
        title: "Please select a subject.",
        icon: "info",
        confirmButtonText: "OK",
        timer: 3000,
      });
      return;
    }
    const data = {
      subject: selectedSubject,
      department: "CSE",
      facultyId: userData._id,
    };
    const response = await axiosInstance.post("/attendance/check-attendance-exists", data);
    console.log("Response is: ", response);
    if (response.data.exists) {
      Swal.fire({
        title: "Attendance already recorded for today.",
        icon: "info",
        confirmButtonText: "OK",
        timer: 3000,
      });
      return;
    }

    const attendanceData = students.map((student) => ({
      studentId: student.student._id,
      facultyId: userData._id,
      subject: selectedSubject,
      department: "CSE",
      date: new Date(),
      status: attendance[student.user._id] || "Present",
      weekNumber: getWeekNumber(new Date()),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    }));

    console.log("Attendance Data:", attendanceData);

    try {
      const response = await axiosInstance.post('/attendance/mark-attendance', { records: attendanceData });
      if (response.status === 201) {
        openNotification("success", "Attendance Submitted Successfully");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("Failed to submit attendance. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">Attendance</h2>

      {/* Subject and Semester Selection */}
      <div className="flex justify-between mb-6">
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="block w-full p-2 border rounded-md text-gray-700 mr-4"
        >
          <option value="">Select a Subject</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="block w-full p-2 border rounded-md text-gray-700 ml-4"
        >
          <option value="">Select a Semester</option>
          {semesters.map((semester) => (
            <option key={semester} value={semester}>
              Semester {semester}
            </option>
          ))}
        </select>

        <button
          onClick={fetchStudents}
          className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Load Students
        </button>
      </div>

      {loading ? (
        <p className="text-center text-indigo-500 animate-pulse">Loading students...</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold">S.No.</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Reg No</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.user._id} className="border-b hover:bg-indigo-50">
                <td className="py-2 px-4 text-sm text-gray-700">{index + 1}</td>
                <td className="py-2 px-4 text-sm text-gray-700">{student.user.fullName}</td>
                <td className="py-2 px-4 text-sm text-gray-700">{student.user.student.regNo}</td>
                <td className="py-2 px-4">
                  <select
                    value={attendance[student.user._id] || "Absent"}
                    onChange={(e) => handleAttendanceChange(student.user._id, e.target.value)}
                    className="block w-full p-2 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Excused">Excused</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-center mt-6">
        <button
          onClick={submitAttendance}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
}

export default AttendancePage;
