import React, { useState } from 'react';

const AttendanceTable = ({ attendanceData }) => {
  const [sortOrder, setSortOrder] = useState('asc');

  // Function to sort attendance records by date
  const sortedData = [...attendanceData].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2 cursor-pointer" onClick={toggleSortOrder}>
              Date {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((record) => (
            <tr key={record._id}>
              <td className="border px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
