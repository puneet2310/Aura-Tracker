import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import axiosInstance from '../../utils/axios.helper';
import Loading from '../Loading';


function AcademicGoals() {
    const optionsStatus = ['All', 'Active', 'Completed', 'Missed'];
    const optionsSort = ['None', 'Title', 'Description', 'Due Date'];
    
    const [academicGoals, setAcademicGoals] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(optionsStatus[0]);
    const [selectedSort, setSelectedSort] = useState(optionsSort[0]);
    const [goals, setGoals] = useState([]);
    const [isloading, setisLoading] = useState(false)
    // const [showGoals, setShowGoals] = useState(false);
    
    const navigate = useNavigate();

    // const toggleGoals = () => setShowGoals(prev => !prev);
    const onOptionStatusChange = (option) => setSelectedStatus(option);
    const onOptionSortChange = (option) => setSelectedSort(option);

    useEffect(() => {
        setisLoading(true); // Start loading
    
        const fetchGoals = async () => {
            try {
                const goalsResponse = await axiosInstance.get('/acadGoals/get-acad-goals');
                setAcademicGoals(goalsResponse.data.data); // Set the fetched goals
    
                let updatedGoals = [...goalsResponse.data.data]; // Initialize with the fetched data
    
                // Filter by selected status
                if (selectedStatus !== 'All') {
                    updatedGoals = updatedGoals.filter(goal => goal.status === selectedStatus);
                }
    
                // Sort based on selected sort option
                if (selectedSort === 'Title') {
                    updatedGoals = updatedGoals.sort((a, b) => a.title.localeCompare(b.title));
                } else if (selectedSort === 'Description') {
                    updatedGoals = updatedGoals.sort((a, b) => a.description.localeCompare(b.description));
                } else if (selectedSort === 'Due Date') {
                    updatedGoals = updatedGoals.sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
                }
    
                setGoals(updatedGoals); // Set the sorted/filtered goals
            } catch (error) {
                console.error('Error fetching goals:', error); // Handle any fetch errors
            } finally {
                setisLoading(false); // Stop loading after data processing
            }
        };
    
        fetchGoals(); // Fetch the goals
    }, [selectedStatus, selectedSort]); // Dependencies: re-fetch when status or sort changes
    

    const getGoalCountByStatus = (status) => {
        return status === 'All'
            ? academicGoals.length
            : academicGoals.filter(goal => goal.status === status).length;
    };

    return (
        isloading ? (
            <Loading/>
        ) : (
            <div className="container mx-auto mt-8 px-4">
                {/* Section Title & Toggle Button */}
                <div className="flex justify-center items-center">
                    <h4 className="text-xl items-center font-semibold text-gray-800">Academic Goals</h4>
                </div>
    
                <div className='px-4 py-4'>
                    <p className="text-indigo-600 mt-4 flex justify-center items-center animate-pulse">
                        Your academic goals help track your progress and keep you focused on your studies.
                    </p>
    
                    {/* Status Filter Section */}
                    <div className="flex justify-center border-indigo-500 gap-4 mt-6 mb-4">
                        {optionsStatus.map(status => (
                            <button
                                key={status}
                                onClick={() => onOptionStatusChange(status)}
                                className={`flex flex-col items-center justify-center border-indigo-900 p-4 rounded-lg shadow-sm transition-all ${selectedStatus === status ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                <span className="text-2xl font-bold">{getGoalCountByStatus(status)}</span>
                                <span className="text-sm mt-1">{status}</span>
                            </button>
                        ))}
                    </div>
    
                    {/* Sort Option Section */}
                    <div className='flex justify-end mr-4 gap-5'>
                        <select
                            className="rounded-3xl mt-2 px-2 py-2 bg-gray-200 cursor-pointer outline-none"
                            value={selectedSort}
                            onChange={(e) => onOptionSortChange(e.target.value)}
                        >
                            {optionsSort.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
    
                    {/* Display Goals List */}
                    <div className="mt-4">
                        {goals.length > 0 ? (
                            <ul className="space-y-4 overflow-y-auto max-h-96">
                                {goals.map((goal, index) => (
                                    <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition transform hover:-translate-y-1 relative">
                                        <div className="flex-1">
                                            <h5 className="text-lg font-semibold text-gray-800">{goal.title}</h5>
                                            <p className="text-gray-600 mt-1">{goal.description}</p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Due Date: {new Date(goal.targetDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span
                                            className={`absolute bottom-2 right-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${goal.status === 'Active' ? 'bg-indigo-500' : goal.status === 'Completed' ? 'bg-green-500' : 'bg-red-500'} text-white`}
                                        >
                                            {goal.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-600 mt-4">
                                {selectedStatus === 'All' ? 'No academic goals set yet.' : `No ${selectedStatus} goals found.`}
                            </p>
                        )}
    
                        <span className="flex justify-center mt-10 mb-5 text-indigo-600">
                            Do you want to <span className="ml-1 mr-1">
                                <a href="/dashboard/all-acad-goals" className="text-indigo-600 underline hover:text-indigo-800">edit</a>
                            </span> your goals?
                        </span>
                    </div>
                </div>
            </div>
        )
    );

}    
export default AcademicGoals;
