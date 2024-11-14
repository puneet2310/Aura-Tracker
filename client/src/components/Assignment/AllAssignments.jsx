import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios.helper.js';
import { FaFilePdf } from 'react-icons/fa';
import Loading from '../Loading.jsx';
import Button from '../Button.jsx';
import { openNotification } from '../Notification/antd';
import Swal from 'sweetalert2';

function AllAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [semester, setSemester] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [stream, setStream] = useState('');
    const [file, setFile] = useState(null); // New state for file upload
    const [userId, setUserId] = useState('');

    const subjects = ['Analysis of Algorithms', 'Automata', 'OOPs'];

    const fetchAssignments = async () => {
        if (!semester || !selectedSubject || !stream) return;
        setLoading(true);
        try {
            const user = await axiosInstance.get("/student/get-profile");
            setUserId(user.data.data.student._id);
            const response = await axiosInstance.get(`/assignment/get-assignment/${stream}/${semester}/${selectedSubject}`);
            setAssignments(response.data.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get("/student/get-profile");
            setSemester(response.data?.data?.student?.semester);
            setStream(response.data?.data?.student?.stream);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmitAssignment = async (assignmentId) => {
        if (!file) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select a file to submit.',
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('assignmentId', assignmentId);
        try {
            setLoading(true);
            await axiosInstance.post(`/assignment/submit-assignment/${assignmentId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            openNotification('success', 'Assignment Submitted');
            setFile(null);
        } catch (error) {
            console.error('Error submitting assignment:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchAssignments();
    }, [semester, selectedSubject, stream]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // Format as dd/mm/yyyy
    };

    const isMissed = (dueDate) => {
        return new Date(dueDate) < new Date(); // Compare with current date
    };

    return (
        <div className="flex flex-col items-center min-h-screen px-4 bg-gray-100">
            <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Assignment Filter</h2>

                {/* Filters */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="text-black font-semibold mb-2 block">Subject</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full p-2 border rounded-md bg-gray-50 focus:outline-indigo-600"
                        >
                            <option value="">Select Subject</option>
                            {subjects.map((subject) => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Assignment List */}
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">Assignments</h3>
                    {loading ? (
                        <Loading />
                    ) : assignments.length > 0 ? (
                        <ul className="space-y-4">
                            {assignments.map((assign) => {
                                const userHasSubmitted = assign.submissions.some(sub => sub.student === userId);
                                const missed = isMissed(assign.dueDate);

                                return (
                                    <li key={assign.id} className="p-4 border rounded-md shadow-sm flex flex-col space-y-3">
                                        <h4 className="font-semibold">{assign.title}</h4>
                                        <p className="text-gray-600">Description: {assign.description}</p>
                                        <p className="text-gray-600">
                                            Due Date: {formatDate(assign.dueDate)}
                                            {!userHasSubmitted && missed && (
                                                <span className="text-red-500 ml-2">(Missed)</span>
                                            )}
                                        </p>

                                        {/* PDF Download Link with Icon */}
                                        {assign.assignment ? (
                                            <div className="mt-4 flex items-center space-x-2">
                                                <FaFilePdf className="text-red-600" size={20} />
                                                <a
                                                    href={assign.assignment}
                                                    download
                                                    className="text-indigo-500 underline hover:text-indigo-700"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Download PDF
                                                </a>
                                            </div>
                                        ) : (
                                            <p className="text-red-500">PDF file not available</p>
                                        )}

                                        {/* File Upload and Submit Button */}
                                        {userHasSubmitted ? (
                                            <p className="text-green-500">Assignment already submitted</p>
                                        ) : (
                                            !missed && (
                                                <div className="mt-4 flex items-center space-x-2">
                                                    <input
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        className="border rounded-md p-2"
                                                    />
                                                    <button
                                                        onClick={() => handleSubmitAssignment(assign._id)}
                                                        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                                                    >
                                                        Submit Assignment
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p>No assignments found for the selected filters.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AllAssignments;
