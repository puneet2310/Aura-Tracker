import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios.helper';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Loading from '../Loading';

function DisplayStudent() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [selectedCR, setSelectedCR] = useState(null);
  const [currentCR, setCurrentCR] = useState(null);
  const [isSemesterSelected, setIsSemesterSelected] = useState(false); // New state to track semester selection
  const userData = useSelector((state) => state.auth.userData);

  // Fetch department info on component load
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axiosInstance.get(`/faculty/get-profile`);
        setDepartment(response.data.data.faculty.department);
      } catch (error) {
        console.log('Error fetching department:', error);
      }
    };
    fetchDepartment();
  }, []);

  // Fetch students based on selected semester
  const loadStudents = async () => {
    if (!semester) {
      // alert("Please select a semester.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(`/faculty/get-students-list/${department}/${semester}`);
      setStudents(response.data.data);
      const response2 = await axiosInstance.get(`/classRepresentative/get-class-representive/${department}/${semester}`);
      setCurrentCR(response2.data.data);
    } catch (error) {
      console.log('Error fetching students or CR:', error);
    }
    setLoading(false);
    setIsSemesterSelected(true); // Update to reflect the semester is loaded
  };

  useEffect(() => {
    loadStudents()
  }, [semester])


  const handleSetCR = async () => {
    if (selectedCR && semester) {
      if (currentCR && currentCR[0].student._id === selectedCR) {
        Swal.fire({
          title: 'Error',
          text: 'This student is already the Class Representative.',
          icon: 'info',
          confirmButtonText: 'OK',
        });
        return;
      }

      const confirmResult = await Swal.fire({
        title: 'Are you sure?',
        text: currentCR ? "Changing the current Class Representative?" : "Set this student as Class Representative?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, set as CR!',
      });

      if (confirmResult.isConfirmed) {
        try {
          const response = await axiosInstance.post(`/classRepresentative/create-class-representive`, {
            studentId: selectedCR,
            department,
            semester,
          });
          toast.success('Class Representative updated successfully!');
          loadStudents(); // Reload students to update the displayed CR
        } catch (error) {
          console.log('Error setting Class Representative:', error);
        }
      }
    } else {
      alert('Please select a student and semester.');
    }
  };

  return (
    <div className="max-w-4xl min-h-screen mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        List of {department} Students
      </h3>

      {currentCR && (
        <p className="mb-4 text-center text-red-600 font-semibold">
          Current Class Representative: {currentCR[0]?.student?.user?.fullName} (Reg No: {currentCR[0]?.student?.regNo})
        </p>
      )}

      <div className="flex items-center justify-between mb-6">
        <select
          value={semester}
          onChange={(e) => {
            setSemester(e.target.value);
            setIsSemesterSelected(false); // Reset the flag when semester changes
            setStudents([]); // Clear the students list when semester changes
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select Semester</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
          {/* Add more semesters as needed */}
        </select>

        <button
          onClick={loadStudents}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          Load Students
        </button>
      </div>

      {loading ? (
        <Loading/>
      ) : !isSemesterSelected && semester ? (
        <p className="text-center text-gray-500 text-lg">
          Please load the students for Semester {semester}.
        </p>
      ) : isSemesterSelected && students.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No students found for Semester {semester}.
        </p>
      ) : (
        <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Full Name</th>
              <th className="py-3 px-4 text-left">Reg No</th>
              <th className="py-3 px-4 text-left">Contact No</th>
              <th className="py-3 px-4 text-left">Select CR</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student.student._id}
                className={`border-b hover:bg-indigo-50 transition-colors duration-200 ${
                  currentCR && currentCR[0]?.student?._id === student.student._id ? 'bg-red-100 font-semibold' : ''
                }`}
              >
                <td className="py-2 px-4 text-gray-700">{index + 1}</td>
                <td className="py-2 px-4 text-gray-700">{student.user.fullName}</td>
                <td className="py-2 px-4 text-gray-700">{student.user.student.regNo}</td>
                <td className="py-2 px-4 text-gray-700">{student.user.student.mobNo}</td>
                <td className="py-2 px-4 text-gray-700">
                  <input
                    type="radio"
                    name="cr"
                    value={student.student._id}
                    checked={selectedCR === student.student._id}
                    onChange={() => setSelectedCR(student.student._id)}
                  />{' '}
                  Select
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSetCR}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          Set CR
        </button>
      </div>
    </div>
  );
}

export default DisplayStudent;
