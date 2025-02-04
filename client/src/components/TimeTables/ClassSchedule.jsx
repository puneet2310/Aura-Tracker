import React, { useState, useEffect } from 'react';
import Button from '../Button';
import axiosInstance from '../../utils/axios.helper';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ClassSchedule = ({ stream, semester }) => {
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [isCR, setIsCR] = useState(false);

    const times = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
        '14:00', '15:00', '16:00', '17:00'
    ];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axiosInstance.get(`/timetable/${stream}/${semester}`);
                setSchedule(response.data.data);

                const response2 = await axiosInstance.get(`/classRepresentative/check-cr-status/${userData._id}`);
                console.log(response2);
                setIsCR(response2.data.data.isCR);
                setError(''); // Clear any previous errors
            } catch (err) {
                console.error('Error fetching the schedule:', err);
                setError('Error fetching the schedule.');
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [stream, semester]);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (!loading && error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    // Helper function to get the class for a specific day and time
    const getClassForTime = (day, time) => {
        const daySchedule = schedule[0]?.weeklySchedule.find(d => d.day === day);
        if (daySchedule) {
            return daySchedule.classes.find(cls => cls.startTime === time);
        }
        return null;
    };

    // Helper to create time ranges for display
    const getTimeRange = (startTime) => {
        const [hour, minute] = startTime.split(':').map(Number);
        const endTime = `${String(hour + 1).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        return `${startTime} - ${endTime}`;
    };

    return (
        <>
            <div className="max-w-fit mx-auto my-8 p-4 border border-gray-300 rounded shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-4 text-black">
                    Class Schedule for {stream} ({semester})
                </h2>
                {schedule ? (
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border border-gray-300">Day/Time</th>
                                {times.map((time, index) => (
                                    <th key={index} className="py-2 px-4 border border-gray-300">
                                        {getTimeRange(time)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {days.map((day, dayIndex) => (
                                <tr key={dayIndex}>
                                    <td className="py-2 px-4 border border-gray-300 font-bold text-black">{day}</td>
                                    {times.map((time, timeIndex) => {
                                        const classInfo = getClassForTime(day, time);
                                        return (
                                            <td key={timeIndex} className="py-2 px-4 border border-gray-300 text-center">
                                                {classInfo ? (
                                                    <>
                                                        <div className="text-black">{classInfo.subject}</div>
                                                        <div className="text-sm text-gray-500">{classInfo.instructor}</div>
                                                    </>
                                                ) : (
                                                    <div className="text-gray-400">---</div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center text-black">No schedule available.</div>
                )}
            </div>

            {/* Conditional rendering for "Edit Schedule" button */}
            {isCR ? (
                <Button
                    type="button"
                    className="w-full bg-indigo-500 text-white rounded-md py-2 px-4 hover:bg-indigo-600"
                    loading={loading}
                    onClick={() => navigate('/timetable/edit')}
                >
                    Edit Schedule
                </Button>
            ) : (
                <div className="text-indigo-600 mb-2 flex justify-center">
                    Contact your CR to edit the schedule.
                </div>
            )}
        </>
    );
};

export default ClassSchedule;
