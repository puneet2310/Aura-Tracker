import React from 'react';
import ClassSchedule from './ClassSchedule';
import { useSelector } from 'react-redux';

const TimetablePage = () => {
    const userData = useSelector((state) => state.auth.userData);

    if (!userData) {
        return <p>Loading...</p>; // Add a loading indicator or fallback UI
    }

    const stream = userData.stream;
    const semester = "Semester " + userData.semester;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Timetable</h1>
            <ClassSchedule stream={stream} semester={semester}/>
        </div>
    );
};


export default TimetablePage;
