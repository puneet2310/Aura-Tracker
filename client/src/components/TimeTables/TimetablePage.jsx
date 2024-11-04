import React from 'react';
import ClassSchedule from './ClassSchedule';

const TimetablePage = () => {
    const stream = 'ECE'; 
    const semester = 'Semester 1'; // this is the sample once the frontend is done we fetch the user stream and semester from the backend or store 
    console.log("here")
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Timetable</h1>
            <ClassSchedule stream={stream} semester={semester}/>
        </div>
    );
};

export default TimetablePage;
