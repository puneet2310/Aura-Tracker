import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios.helper';
import { useSelector } from 'react-redux';
import { FaCoins } from 'react-icons/fa';
function AcadLeaderBoard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = useSelector((state) => state.auth.userData);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const topUsers = await axiosInstance.get('/users/get-top-users');
                setLeaderboardData(topUsers.data.data); 
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboardData();
    }, []);

    const getMedalIcon = (index) => {
        if (index === 0) return '🥇'; 
        if (index === 1) return '🥈';
        if (index === 2) return '🥉'; 
        return '🏅'; // Generic medal emoji for other places
    };

    return (
        <div className="leaderboard-container bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">
               Academic Leaderboard
            </h2>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : (
                <ul className="overflow-y-auto max-h-64"> {/* Set maximum height for scrolling */}
                    {leaderboardData?.map((user, index) => (
                        <li key={index} className={`flex items-center justify-between border-b last:border-b-0 border-gray-300 hover:transform hover:scale-105 transition-transform duration-300 rounded-lg px-2 py-3 ${currentUser?.userName === user.userName ? 'bg-sky-200' : ''}`}>
                            <div className="flex items-center">
                                <span className="mr-3 text-2xl">{getMedalIcon(index)}</span>
                                <span className={`font-semibold text-gray-800 `}>
                                    {user.userName} {currentUser?.userName === user.userName ? "(You)" : ""}
                                </span>
                            </div>
                            <div className="top-4 right-4 flex items-center text-indigo-600">
                            <span className="ml-1 font-semibold mr-1">{user.acadAura}</span>
                            {"pts."}
                            <FaCoins size={20} className='text-yellow-500' />
                        </div>

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AcadLeaderBoard;
