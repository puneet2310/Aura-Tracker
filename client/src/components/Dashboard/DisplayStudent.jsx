import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios.helper';
import { useSelector } from 'react-redux';

function DisplayStudent() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState('');
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const getDepartment = await axiosInstance.get(`/faculty/get-profile`);
        setDepartment(getDepartment.data.data.faculty.department);  
        console.log("department",department)
        const response = await axiosInstance.get(`/faculty/get-students-list/${department}`);
        setStudents(response.data.data);
      } catch (error) {
        console.log('Error fetching students:', error);
      }
      setLoading(false);
    };

    fetchStudents();
  }, [department]);

  if (loading) {
    return <p className="min-h-screen flex items-center justify-center text-lg text-center text-indigo-500 animate-pulse">Loading students...</p>;
  }

  return (
    <div className="max-w-4xl min-h-screen mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-3xl font-semibold text-center mb-6 text-gray-800">List of {department} students</h3>
      <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left">#</th>
            <th className="py-3 px-4 text-left">Full Name</th>
            <th className="py-3 px-4 text-left">Reg No</th>
            <th className="py-3 px-4 text-left">Contact No</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id} className="border-b hover:bg-indigo-50 transition-colors duration-200">
              <td className="py-2 px-4 text-gray-700">{index + 1}</td>
              <td className="py-2 px-4 text-gray-700">{student.user.fullName}</td>
              <td className="py-2 px-4 text-gray-700">{student.user.student.regNo}</td>
              <td className="py-2 px-4 text-gray-700">{student.user.student.mobNo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DisplayStudent;
