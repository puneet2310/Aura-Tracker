import React from 'react';
import ClassSchedule from './ClassSchedule';

const TimetablePage = () => {
    const branch = 'CSE'; // Replace this with dynamic branch selection if needed
    console.log("here")
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Timetable</h1>
            <ClassSchedule branch={branch} />
        </div>
    );
};

export default TimetablePage;
