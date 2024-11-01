import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axios.helper';
import { FaEdit, FaSave, FaTrashAlt, FaCheckCircle, FaRegCircle, FaCoins, FaTimesCircle } from 'react-icons/fa';
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
                const response = await axiosInstance.get('/acadGoals/get-acad-goals');
                const userGoals = response.data.data.map(goal => ({
                    _id: goal._id,
                    title: goal.title,
                    description: goal.description,
                    targetDate: goal.targetDate,
                    isComplete: goal.isComplete,
                    status: goal.status,
                }));
                setGoals(userGoals);
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
        if(goals[index].status === 'Completed') {
            Swal.fire({
                title: "You can't edit a completed goal",
                icon: 'info',
                confirmButtonText: 'OK'
            });
            return;
        }
        else if (goals[index].status === 'Missed') {
            Swal.fire({
                title: "You can't edit a missed goal",
                icon: 'info',
                confirmButtonText: 'OK'
            });
            return;
        }
        
        setEditableGoalIndex(index);
    };

    const handleSaveClick = async (index) => {
        setEditableGoalIndex(null);
        try {
            const updatedGoal = goals[index];
            await axiosInstance.put(`/acadGoals/update-acad-goal`, updatedGoal);
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
        if(goals[index].status === "Completed") {
            Swal.fire({
                title: 'Goal is already completed!',
                text: "You can't change the status of a completed goal.",
                icon: 'success',
                confirmButtonText: 'OK',
            });
            return ;
        }
        else if(goals[index].status === "Missed"){
            Swal.fire({
                title: 'Goal is missed!',
                description: "You can't change the status of a missed goal.",
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return ;
        }

        console.log(goals[index])

        const updatedGoals = goals.map((goal, i) => 
            i === index ? { ...goal, isComplete: !goal.isComplete, status: "Completed" } : goal
        );
        setGoals(updatedGoals);

        try {
            const updatedGoal = updatedGoals[index];
            console.log("Updated Goal:", updatedGoal);
            await axiosInstance.put(`/acadGoals/update-acad-goal`, updatedGoal);
            openNotification('success', `Goal marked as completed`);
        } catch (error) {
            console.log("Error updating goal:", error);
        }
    };

    const handleDeleteGoalConfirmed = async (index) => {
        const goalToDelete = goals[index];
        try {
            await axiosInstance.delete(`/acadGoals/delete-acad-goal`, { data: { id: goalToDelete._id } });
            setGoals((prevGoals) => prevGoals.filter((_, i) => i !== index));
            openNotification('success', 'Goal deleted successfully');
        } catch (error) {
            console.log("Error deleting goal:", error);
        }
    };
    
    const handleDeleteGoal = async (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this goal!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await handleDeleteGoalConfirmed(index);
            }
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start p-8 bg-gradient-to-br from-indigo-100 to-indigo-300">
            <h1 className="text-4xl font-bold mb-4 text-indigo-700">Academic Goals</h1>
    
            <div className="w-full max-w-4xl mb-8 text-gray-600">
                <p className="text-lg font-medium mb-2">Instructions:</p>
                <ul className="list-disc list-inside pl-4 space-y-2">
                    <li>You can add new academic goals and track your progress.</li>
                    <li>Edit a goal by clicking the edit icon and save your changes.</li>
                    <li>Once a goal is marked as complete, you cannot edit it.</li>
                    <li>Earn +10 points for each goal you mark as completed.</li>
                    <li>Delete a goal by clicking the delete icon if it's no longer needed.</li>
                </ul>
            </div>
    
            <div className="w-full max-w-4xl space-y-8">
                {goals.map((goal, index) => (
                    <div
                        key={index}
                        className={`relative p-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105 ${goal.status === 'Completed' ? 'bg-green-100' : goal.status === 'Missed' ? 'bg-red-100' : 'bg-white'}`}
                    >
                        <div className="absolute top-4 right-4 flex items-center text-yellow-500">
                            <FaCoins size={20} />
                            {" "}
                            <span className="ml-1 font-semibold"> {goal.status === 'Completed' ? "" : "+"}10</span>
                        </div>
    
                        <div className="flex justify-between items-start">
                            <button
                                onClick={() => toggleCompletion(index)}
                                className={`mr-4 ${goal.status === 'Completed' ? 'text-green-500' : goal.status === 'Missed' ? 'text-red-500' : 'text-gray-500'} ${goal.status !== "Missed" ? 'hover:text-green-700' : ''} transition duration-200`}
                                title={goal.status === 'Completed' ? "Already complete" : goal.status === 'Missed' ? "Goal missed" : "Mark as Complete"}
                            >
                                {goal.status === 'Completed' ? <FaCheckCircle size={24} /> : goal.status === 'Missed' ? <FaTimesCircle size={24} /> : <FaRegCircle size={24} />}
                            </button>
    
                            <h2 className="text-2xl font-bold mb-2 text-gray-800 flex-1">
                                {editableGoalIndex === index ? (
                                    <input
                                        className="w-full border-b-2 border-indigo-500 focus:outline-none"
                                        value={goal.title}
                                        onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                                    />
                                ) : (
                                    goal.title
                                )}
                            </h2>
    
                            <button
                                onClick={() => 
                                    editableGoalIndex === index ? handleSaveClick(index) : handleEditClick(index)
                                }
                                className=" mt-3 text-indigo-500 hover:text-indigo-700 transition duration-200"
                            >
                                {editableGoalIndex === index ? <FaSave size={24} /> : <FaEdit size={24} />}
                            </button>
                        </div>
    
                        <div className="mt-4">
                            {editableGoalIndex === index ? (
                                <textarea
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:border-indigo-500 transition duration-200"
                                    rows="3"
                                    value={goal.description}
                                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                                />
                            ) : (
                                <p className={`text-gray-600 ${goal.status === 'Completed' ? 'line-through' : ''}`}>
                                    {goal.description}
                                </p>
                            )}
                        </div>
    
                        <p className="text-sm text-gray-500 mt-4">
                            Due Date: {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
    
                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={() => handleDeleteGoal(index)}
                                className="px-4 py-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition duration-200 flex items-center"
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
