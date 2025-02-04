import React, { useEffect, useState } from 'react';
import ClassSchedule from './ClassSchedule';
import axiosInstance from '../../utils/axios.helper';
import Loading from '../Loading';

const TimetablePage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stream, setStream] = useState('');
    const [semester, setSemester] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/student/get-profile');
                console.log("response: ", response);

                console.log("response: ", response?.data?.data?.student.stream);

                setStream(response?.data?.data?.student.stream || ''); 
                setSemester("Semester " + (response?.data?.data?.student.semester || ''));
                setError(null); // Clear any previous errors
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <Loading />; // Ensure Loading component is rendered correctly
    }

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>; // Styled error message
    }

    console.log("Stream: ", stream);  
    console.log("Semester: ", semester);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6 text-black">Timetable</h1>
            <ClassSchedule stream={stream} semester={semester} />
        </div>
    );
};

export default TimetablePage;
