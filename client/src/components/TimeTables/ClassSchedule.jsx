import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios.helper';

const ClassSchedule = ({ branch }) => {
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axiosInstance.get(`/timetable/branch`);
                consoel.log("response")
                setSchedule(response.data.data);
            } catch (err) {
                setError('Error fetching the schedule.');
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [branch]);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="max-w-2xl mx-auto my-8 p-4 border border-gray-300 rounded shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Class Schedule for {branch}</h2>
            {schedule ? (
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border border-gray-300">Day</th>
                            <th className="py-2 px-4 border border-gray-300">Time</th>
                            <th className="py-2 px-4 border border-gray-300">Subject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.classes.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border border-gray-300">{item.day}</td>
                                <td className="py-2 px-4 border border-gray-300">{item.time}</td>
                                <td className="py-2 px-4 border border-gray-300">{item.subject}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center">No schedule available.</div>
            )}
        </div>
    );
};

export default ClassSchedule;
