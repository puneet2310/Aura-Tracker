import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axios.helper';

function AllAcadGoals() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(false);
    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        const fetchGoals = async () => {
            setLoading(true);
            try {
                const userGoals = userData.academicGoals;
                console.log("User academic goals:", userGoals);

                const goalsData = [];
                for (let i = 0; i < userGoals.length; i++) {
                    const goal = userGoals[i];
                    console.log("Fetching goal:", goal);
                    const response = await axiosInstance.get('/acadGoals/get-acad-goals');
                    const goalDetails = response.data.data[i]; // Assuming each goal fetch returns one item
                    console.log("Fetched goal details:", goalDetails);
                    goalsData.push({
                        title: goalDetails.title,
                        description: goalDetails.description,
                        DueDate: goalDetails.targetDate
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

    return (
        <div className="min-h-screen flex flex-col items-center justify-start p-8">
            <h1 className="text-3xl font-bold mb-6">Academic Goals</h1>
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : (
                <div className="w-full max-w-3xl space-y-6">
                    {goals.map((goal, index) => (
                        <div
                            key={index}
                            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <h2 className="text-2xl font-semibold text-gray-800">{goal.title}</h2>
                            <p className="text-gray-600 mt-2">{goal.description}</p>
                            <p className="text-sm text-gray-500 mt-4">
                                <span className="font-medium">Due Date:</span> {goal.DueDate}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AllAcadGoals;
