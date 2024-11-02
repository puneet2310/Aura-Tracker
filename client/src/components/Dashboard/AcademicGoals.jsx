import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';

function AcademicGoals({ academicGoals = [] }) {
    const optionsStatus = ['All', 'Active', 'Completed', 'Missed'];
    const optionsSort = ['None', 'Title', 'Description', 'Due Date'];
    
    const [selectedStatus, setSelectedStatus] = useState(optionsStatus[0]);
    const [selectedSort, setSelectedSort] = useState(optionsSort[0]);
    const [goals, setGoals] = useState([]);
    const [showGoals, setShowGoals] = useState(false);
    
    const navigate = useNavigate();

    const toggleGoals = () => setShowGoals((prev) => !prev);

    const onOptionStatusChange = (option) => setSelectedStatus(option);
    const onOptionSortChange = (option) => setSelectedSort(option);

    useEffect(() => {
       
        let updatedGoals = [...academicGoals];

        // Filter goals based on the selected status
        if (selectedStatus !== 'All') {
            updatedGoals = updatedGoals.filter(goal => goal.status === selectedStatus);
        }

        // Sort the filtered goals based on selected sort option
        if (selectedSort === 'Title') {
            updatedGoals = updatedGoals.sort((a, b) => a.title.localeCompare(b.title));
        } else if (selectedSort === 'Description') {
            updatedGoals = updatedGoals.sort((a, b) => a.description.localeCompare(b.description));
        } else if (selectedSort === 'Due Date') {
            updatedGoals = updatedGoals.sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
        }

        // Update the state only once with the final, processed list
        setGoals(updatedGoals);
    }, [academicGoals, selectedStatus, selectedSort]);

    const getGoalCountByStatus = (status) => {
        return status === 'All' 
            ? academicGoals.length 
            : academicGoals.filter(goal => goal.status === status).length;
    }
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
                <h4 className="text-xl font-semibold text-gray-800">Academic Goals</h4>
                <Button
                    onClick={toggleGoals}
                    className="flex items-center bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300"
                >
                    {showGoals ? <FaChevronUp className="mr-2" /> : <FaChevronDown className="mr-2" />}
                    {showGoals ? 'Hide Goals' : 'Show Goals'}
                </Button>
            </div>

            {showGoals && (
                <>
                    <p className="text-gray-600 mt-4">
                        Your academic goals help track your progress and keep you focused on your studies.
                    </p>

                    <div className="flex gap-4 mt-6 mb-4">
                        {optionsStatus.map(status => (
                            <button
                                key={status}
                                onClick={() => onOptionStatusChange(status)}
                                className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-sm transition-all ${
                                    selectedStatus === status 
                                        ? 'bg-indigo-500 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <span className="text-2xl font-bold">{getGoalCountByStatus(status)}</span>
                                <span className="text-sm mt-1">{status}</span>
                            </button>
                        ))}
                    </div>

                    <div className='flex justify-end mr-4 gap-5'>
                        <select
                            className="rounded-3xl mt-2 px-2 py-2 bg-gray-100 cursor-pointer outline-none"
                            value={selectedSort}
                            onChange={(e) => onOptionSortChange(e.target.value)}
                        >
                            {optionsSort.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-4">
                        {goals.length > 0 ? (
                            <ul className="space-y-4 overflow-y-auto max-h-96">
                                {goals.map((goal, index) => (
                                    <li
                                        key={index}
                                        className="bg-gray-100 p-4 overflow-auto rounded-lg shadow-md hover:bg-gray-200 transition transform hover:-translate-y-1"
                                    >
                                        <h5 className="text-lg font-semibold text-gray-800">{goal.title}</h5>
                                        <p className="text-gray-600 mt-1">{goal.description}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Due Date: {new Date(goal.targetDate).toLocaleDateString()}
                                        </p>
                                        <span
                                            className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                                                goal.status === "Active" ? "bg-indigo-500" :
                                                goal.status === "Completed" ? "bg-green-500" : "bg-red-500"
                                            } text-white`}
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

                        <Button
                            onClick={() => navigate('/all-acad-goals')}
                            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300 block mx-auto"
                        >
                            Edit Academic Goals
                        </Button>
                        <Button
                            onClick={() => navigate('/set-acad-goals')}
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300 block mx-auto"
                        >
                            Set New Academic Goals
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

export default AcademicGoals;
