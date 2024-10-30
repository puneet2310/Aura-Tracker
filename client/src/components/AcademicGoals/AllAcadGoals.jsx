import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axios.helper';
import { FaEdit, FaSave, FaTrashAlt, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { openNotification } from '../Notification/antd';
import Swal from 'sweetalert2';

function AllAcadGoals() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editableGoalIndex, setEditableGoalIndex] = useState(null);

    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        const fetchGoals = async () => {
            setLoading(true);
            try {
                const userGoals = userData.academicGoals;
                const goalsData = [];
                const response = await axiosInstance.get('/acadGoals/get-acad-goals');

                for (let i = 0; i < userGoals.length; i++) {
                    const goalDetails = response.data.data[i];
                    console.log("Goal details: ", goalDetails);
                    goalsData.push({
                        id: goalDetails._id,
                        title: goalDetails.title,
                        description: goalDetails.description,
                        DueDate: goalDetails.targetDate,
                        completed: goalDetails.isComplete,
                    });
                }
                setGoals(goalsData);
            } catch (error) {
                console.log('Error fetching goals:', error);
            } finally {
                setLoading(false);
            }
        };

        if (authStatus) {
            fetchGoals();
        }
    }, [authStatus, userData]);

    const handleEditClick = (index) => {
        setEditableGoalIndex(index);
    };

    const handleSaveClick = async (index) => {
        setEditableGoalIndex(null);
        try {
            const updatedGoal = goals[index];
            const response = await axiosInstance.put(`/acadGoals/update-acad-goal`, updatedGoal);
            openNotification('success', 'Goal saved successfully');
        } catch (error) {
            console.log("Error updating goal:", error);
        }
    };

    const handleInputChange = (index, field, value) => {
        setGoals((prevGoals) => {
            const updatedGoals = [...prevGoals];
            updatedGoals[index][field] = value;
            return updatedGoals;
        });
    };

    const toggleCompletion = async (index) => {
        const updatedGoals = goals.map((goal, i) => 
            i === index ? { ...goal, completed: !goal.completed } : goal
        );
        setGoals(updatedGoals);

        try {
            const updatedGoal = updatedGoals[index];
            const response = await axiosInstance.put(`/acadGoals/update-acad-goal`, updatedGoal);
            
            if(updatedGoal.completed) {
                openNotification('success', 'Goal marked as completed');
            } else {
                openNotification('success', 'Goal marked as incomplete');
            }
        } catch (error) {
            console.log("Error updating goal:", error);
        }
    };

    const handleDeleteGoal = async (index) => {
        const goalToDelete = goals[index];
        console.log(goalToDelete)
        try {
            const response = await axiosInstance.delete(`/acadGoals/delete-acad-goal`, { data: { id: goalToDelete.id } });
            console.log(response)
            if (response.status === 200) {
                const updatedGoals = goals.filter((_, i) => i !== index);
                setGoals(updatedGoals);
                openNotification('success', 'Goal deleted successfully');
            }
        } catch (error) {
            console.log("Error deleting goal:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start p-8 bg-gray-50">
            <h1 className="text-4xl font-bold mb-8 text-blue-600">Academic Goals</h1>
            <div className="w-full max-w-4xl space-y-8">
                {goals.map((goal, index) => (
                    <div
                        key={index}
                        className="relative p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-start">
                            <button
                                onClick={() => toggleCompletion(index)}
                                className="mr-4 text-green-500 hover:text-green-700 transition duration-200"
                                title={goal.completed ? "Mark as Incomplete" : "Mark as Complete"}
                            >
                                {goal.completed ? <FaCheckCircle size={24} /> : <FaRegCircle size={24} />}
                            </button>

                            <h2 className="text-2xl font-bold mb-2 flex-1">{goal.title}</h2>
                            
                            <button
                                onClick={() => 
                                    editableGoalIndex === index ? handleSaveClick(index) : handleEditClick(index)
                                }
                                className="text-blue-500 hover:text-blue-700 transition duration-200"
                            >
                                {editableGoalIndex === index ? <FaSave size={24} /> : <FaEdit size={24} />}
                            </button>
                        </div>

                        <div className="mt-4">
                            {editableGoalIndex === index ? (
                                <textarea
                                    className="text-gray-600 mt-2 w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
                                    rows="4"
                                    value={goal.description}
                                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                                />
                            ) : (
                                <p className={`text-gray-600 mt-2 ${goal.completed ? 'line-through' : ''}`}>
                                    {goal.description}
                                </p>
                            )}
                        </div>

                        <p className="text-sm text-gray-500 mt-4">
                            <span className="font-medium">Due Date:</span> {goal.DueDate}
                        </p>

                        <div className="absolute bottom-4 right-4 flex space-x-2">
                            <button
                                onClick={() => handleDeleteGoal(index)}
                                className="px-4 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition duration-200 flex items-center"
                            >
                                <FaTrashAlt size={16} className="mr-2" /> Delete
                            </button>
                        </div>
                    </div>
                ))}
                {loading && (
                    <p className="text-center text-gray-500">Loading goals...</p>
                )}
            </div>
        </div>
    );
}

export default AllAcadGoals;
