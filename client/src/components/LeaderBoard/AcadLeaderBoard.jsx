import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios.helper';
import { useSelector } from 'react-redux';
import { FaCoins } from 'react-icons/fa';
import Loading from '../Loading';
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
        <div className="leaderboard-container bg-gradient-to-b from-indigo-100 to-white p-8 rounded-xl shadow-xl max-w-3xl mx-auto mt-10">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700 tracking-wide">
                Academic Leaderboard
            </h2>
            {loading ? (
                <Loading/>
            ) : (
                <ul className="overflow-y-auto max-h-72 space-y-3">
                    {leaderboardData?.map((user, index) => (
                        <li
                            key={index}
                            className={`flex items-center justify-between bg-white border-b last:border-b-0 border-gray-200 hover:bg-indigo-50 hover:shadow-md hover:scale-105 transform transition-transform duration-300 rounded-lg px-6 py-4 ${currentUser?.userName === user.userName ? 'bg-indigo-100 border-indigo-300' : ''
                                }`}
                        >
                            <div className="flex items-center">
                                <span className="mr-4 text-2xl">{getMedalIcon(index)}</span>
                                <span className={`font-bold text-gray-800 text-lg`}>
                                    {user.userName} {currentUser?.userName === user.userName ? "(You)" : ""}
                                </span>
                            </div>
                            <div className="flex items-center text-indigo-600">
                                <span className="ml-1 font-semibold text-lg mr-2">{user.acadAura}</span>
                                <span className="text-gray-600">pts.</span>
                                <FaCoins size={24} className='ml-2 text-yellow-500' />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>

    );
}

export default AcadLeaderBoard;
