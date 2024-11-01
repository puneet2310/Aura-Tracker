import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';

function AcademicGoals({ academicGoals }) {
    const [showGoals, setShowGoals] = useState(false);
    const navigate = useNavigate();

    const toggleGoals = () => {
        setShowGoals((prev) => !prev);
    };

    console.log("Academic Goals are: ", academicGoals);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
                <h4 className="text-xl font-semibold text-gray-800">Academic Goals</h4>
                <Button
                    onClick={toggleGoals}
                    className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    {showGoals ? <FaChevronUp className="mr-2" /> : <FaChevronDown className="mr-2" />}
                    {showGoals ? 'Hide Goals' : 'Show Goals'}
                </Button>
            </div>

            {showGoals && (
                <>
                    <p className="text-gray-600 mt-4">Your academic goals help track your progress and keep you focused on your studies.</p>
                    <div className="mt-4">
                        {academicGoals.length > 0 ? (
                            <ul className="space-y-4">
                                {academicGoals.map((goal, index) => (
                                    <li
                                        key={index}
                                        className="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition transform hover:-translate-y-1"
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
                            <p className="text-gray-600 mt-4">No academic goals set yet.</p>
                        )}

                        <Button
                            onClick={() => navigate('/all-acad-goals')}
                            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 block mx-auto"
                        >
                            Edit Academic Goals
                        </Button>
                        <Button
                            onClick={() => navigate('/set-acad-goals')}
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 block mx-auto"
                        >
                            Add Academic Goals
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

export default AcademicGoals;
