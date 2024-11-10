import React, { useState, useEffect } from 'react';

const AttendanceTable = ({ attendanceData = {}, subjects = [] }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filteredData, setFilteredData] = useState([]);

  // Function to handle subject selection
  const handleSubjectChange = (event) => {
    const selectedSubject = event.target.value;
    setSelectedSubject(selectedSubject);
    if (selectedSubject) {
      setFilteredData(attendanceData[selectedSubject] || []);
    } else {
      setFilteredData([]);
    }
  };

  // Function to sort attendance records by date
  const sortedData = [...filteredData].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  useEffect(() => {
    if (selectedSubject) {
      setFilteredData(attendanceData[selectedSubject] || []);
    }
  }, [selectedSubject, attendanceData]);

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 text-black rounded-lg shadow-lg">
      {/* Subject Selection */}
      <div className="flex justify-between items-center mb-6">
        <label htmlFor="subject" className="text-xl font-semibold">Select Subject:</label>
        <select
          id="subject"
          value={selectedSubject}
          onChange={handleSubjectChange}
          className="border border-gray-300 p-2 rounded-lg"
        >
          <option value="">-- Select --</option>
          {subjects.length > 0 && subjects.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      {/* Attendance Table */}
      {filteredData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border px-4 py-2 cursor-pointer" onClick={toggleSortOrder}>
                  Serial {sortOrder === 'asc' ? '▲' : '▼'}
                </th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((record, index) => (
                <tr key={record._id}>
                  <td className="border px-4 py-2">{index + 1}</td> {/* Serial number */}
                  <td className="border px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-red-500">No attendance data available for the selected subject.</p>
      )}
    </div>
  );
};

export default AttendanceTable;
