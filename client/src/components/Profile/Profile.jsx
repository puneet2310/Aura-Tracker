import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import axiosInstance from '../../utils/axios.helper';
import { useDispatch, useSelector } from 'react-redux';
import { login as authLogin } from '../../store/authSlice';


function Profile() {
    const [editField, setEditField] = useState(null);
    const [loading, setLoading] = useState(false); // Single loading state
    const userData = useSelector((state) => state.auth.userData);
    const [isUserDataLoaded, setIsUserDataLoaded] = useState(false); // New loading state for userData
    const [error, setError] = useState(null);
    const [LocalUserInfo, setLocalUserInfo] = useState({
        fullName: '',
        userName: '',
        email: '',
        avatar: '',
        role: '',
        regNo: '',
        semester: '',
        stream: '',
        department: '',
        facultyId: '',
        experience: '',
        lastLogin: '',
        mobNo: '',
    });

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            let response;
            try {
                if(userData?.role === 'Student'){
                    response = await axiosInstance.get('/student/get-profile');
                    setError(null)
                }
                else if(userData?.role === 'Faculty'){
                    response = await axiosInstance.get('/faculty/get-profile');
                    setError(null)
                }
                else{
                    response = await axiosInstance.get('/users/current-user');
                    setError("First save the Role then save the additional information")
                }
                console.log("response: ", response)
                setLocalUserInfo((prevState) => ({
                    ...prevState,
                    fullName: userData?.fullName || response.data.data?.user?.fullName || '',
                    userName: userData?.userName || response.data.data?.user?.userName || '',
                    email: userData?.email || response.data.data?.user?.email || '',
                    avatar: userData?.avatar || response.data.data?.user?.avatar || '',
                    role: userData?.role || response.data.data?.user?.role || '',
                    regNo: response.data.data?.student?.regNo || '',
                    semester: response.data.data?.student?.semester || '',
                    stream: response.data.data?.student?.stream || '',
                    department: response.data.data?.faculty?.department || '',
                    facultyId: response.data.data?.faculty?.facultyId || '',
                    experience: response.data.data?.faculty?.experience || '',
                    lastLogin: response.data.data?.student?.lastLogin || '',
                    mobNo: response.data.data?.student?.mobNo || '',
                }));
                setIsUserDataLoaded(true);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userData]);

    const handleEdit = async (field) => {
        if (editField === field) {
            setLoading(true); // Start loading when saving
            try {
                let response;

                if (userData.role === 'Student') {
                    try {
                        response = await axiosInstance.patch('/student/update-profile', LocalUserInfo);
                    } catch (error) {
                        if(error.response && error.response.status === 403) {   
                            setError("Student with regNo or mobNo already exists");
                        }
                    }
                } else if(userData.role === 'Faculty') {
                    try {
                        response = await axiosInstance.patch('/faculty/update-profile', LocalUserInfo);                        
                    } catch (error) {
                        console.error("Error updating user details:", error);
                        if(error.response && error.response.status === 403) {   
                            setError("Faculty with same ID exists");
                        }
                    }
                }
                else {
                    return <div>Error</div>;
                }
                
                console.log("response: ", response)

                dispatch(authLogin(response.data));
                setEditField(null);
                setError(null);
                window.location.reload();
            } catch (error) {
                console.error("Error updating user details:", error);
            } finally {
                setLoading(false); // Stop loading after save attempt
            }
        } else {
            setEditField(field); // Enable edit mode
        }
    };

    const handleRole = async (role) => {
        try {
            console.log("role is: ",role)
            setLoading(true);
            const response = await axiosInstance.patch('/users/update-account-details', { role });
            console.log("response: ", response)
            dispatch(authLogin(response.data));
            setLoading(false);
            window.location.reload();
        } catch (error) {
            console.error("Error updating user role:", error);
        }
    };

    if (!isUserDataLoaded) {
        return <div>Loading...</div>;
    }
    const handleEditClick = () => {
        setEditField('role'); // When "Edit" is clicked, set the field to editable
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg mb-6 max-w-3xl mx-auto">
            {/* Headline */}
            <h1 className="text-2xl font-bold text-indigo-800 mb-6 text-center">Profile</h1>
            <div className="flex justify-center mb-6">
                <img
                    src={LocalUserInfo.avatar || userData?.avatar}
                    alt="User Profile"
                    className="w-28 h-28 rounded-full shadow-lg"
                />
            </div>
            {/* Profile Fields */}
            <div className="space-y-4">
            {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
                {['fullName', 'userName', 'email'].map((field) => (
                    <div key={field} className="flex flex-col items-start space-y-1">
                        <label className="text-gray-600 font-semibold capitalize">{field}:</label>
                        <div className="flex items-center w-full">
                            <input
                                type="text"
                                value={LocalUserInfo[field] || ''}
                                readOnly={editField !== field}
                                autoFocus={editField === field}
                                onChange={(e) =>
                                    setLocalUserInfo((prev) => ({ ...prev, [field]: e.target.value }))
                                }
                                className={`w-full text-indigo-600 font-semibold bg-gray-100 rounded-md px-3 py-2 outline-none transition-all duration-300 ${
                                    editField === field ? 'border-indigo-600 text-gray-800' : 'border-transparent cursor-text text-gray-500'
                                }`}
                            />
                            <button
                                onClick={() => handleEdit(field)}
                                className="ml-3 text-gray-500 hover:text-indigo-600"
                                disabled={loading}
                            >
                                {loading && editField === field ? 'Saving...' : editField === field ? <FaSave /> : <FaEdit />}
                            </button>
                        </div>
                    </div>
                ))}

                {/* Role Field */}
                <div className="flex items-center space-x-2">
                    <span className="text-indigo-600 font-semibold rounded-md px-3 py-2">Role:</span>
                    {editField === 'role' ? (
                    <>
                        {/* Select dropdown to choose role */}
                        <select
                            value={LocalUserInfo.role || ""}
                            onChange={(e) => setLocalUserInfo((prev) => ({ ...prev, role: e.target.value }))}
                            className="text-indigo-600 font-semibold bg-gray-100 rounded-md px-3 py-2 w-1/2 outline-none border-indigo-600"
                        >
                            <option value="" disabled>Select Role</option>
                            <option value="Student">Student</option>
                            <option value="Faculty">Faculty</option>
                        </select>
                        <button
                            type="button"
                            onClick={() => handleRole(LocalUserInfo.role)}  // Call handleRole on save
                            className="text-gray-500 hover:text-indigo-600"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : <FaSave />}
                        </button>
                    </>
                ) : (
                    <span className="text-gray-600">
                        {LocalUserInfo.role || "Select Role"}
                    </span>
                )}

                {/* Edit Button */}
                <button
                    type="button"
                    onClick={handleEditClick}  // Activate edit mode when clicked
                    className="text-gray-500 hover:text-indigo-600"
                    disabled={loading || editField === 'role'}
                >
                    <FaEdit />
                </button>

                </div>


                {/* Conditional Fields Based on Role */}
                {LocalUserInfo.role === 'Student' && (
                    <>
                        {/* stream Dropdown */}
                        <div className="flex items-center space-y-1">
                            <label className="text-gray-600 font-semibold capitalize mb-2">Stream:</label>
                            <select
                                value={LocalUserInfo.stream || ''}
                                onChange={(e) =>
                                    setLocalUserInfo((prev) => ({ ...prev, stream: e.target.value }))
                                }
                                disabled={editField !== 'stream'}
                                className="text-indigo-600 font-semibold bg-gray-100 rounded-md px-3 py-2 outline-none border-indigo-600"
                            >
                                <option value="">Select Branch</option>
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                <option value="ME">ME</option>
                                {/* Add other branches as options */}
                            </select>
                            <button
                                onClick={() => handleEdit('stream')}
                                className="ml-3 text-gray-500 hover:text-indigo-600"
                                disabled={loading}
                            >
                                {loading && editField === 'stream' ? 'Saving...' : editField === 'stream' ? <FaSave /> : <FaEdit />}
                            </button>
                        </div>
                        
                        {/* Semester Dropdown */}
                        <div className="flex items-center space-y-1">
                            <label className="text-gray-600 font-semibold capitalize mb-2">Semester:</label>
                            <select
                                value={LocalUserInfo.semester || ''}
                                onChange={(e) =>
                                    setLocalUserInfo((prev) => ({ ...prev, semester: e.target.value }))
                                }
                                disabled={editField !== 'semester'}
                                className="text-indigo-600 font-semibold bg-gray-100 rounded-md px-3 py-2 outline-none border-indigo-600"
                            >
                                <option value="">Select Semester</option>
                                {Array.from({ length: 8 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => handleEdit('semester')}
                                className="ml-3 text-gray-500 hover:text-indigo-600"
                                disabled={loading}
                            >
                                {loading && editField === 'semester' ? 'Saving...' : editField === 'semester' ? <FaSave /> : <FaEdit />}
                            </button>
                        </div>

                        {/* Registration Number with Validation */}
                        <div className="flex flex-col items-start space-y-1">
                            <label className="text-gray-600 font-semibold capitalize mb-2">Registration No:</label>
                            <input
                                type="text"
                                value={LocalUserInfo.regNo || ''}
                                readOnly={editField !== 'regNo'}
                                onChange={(e) =>
                                    setLocalUserInfo((prev) => ({
                                        ...prev,
                                        regNo: e.target.value.slice(0, 8) // Restrict to 8 characters
                                    }))
                                }
                                className={`w-full text-indigo-600 font-semibold bg-gray-100 rounded-md px-3 py-2 outline-none transition-all duration-300 ${
                                    editField === 'regNo' ? 'border-indigo-600 text-gray-800' : 'border-transparent cursor-text text-gray-500'
                                }`}
                                placeholder="8-digit Registration Number"
                            />
                            <button
                                onClick={() => handleEdit('regNo')}
                                className="ml-3 text-gray-500 hover:text-indigo-600"
                                disabled={loading}
                            >
                                {loading && editField === 'regNo' ? 'Saving...' : editField === 'regNo' ? <FaSave /> : <FaEdit />}
                            </button>
                            { editField === 'regNo' &&LocalUserInfo.regNo && LocalUserInfo.regNo.length !== 8 && (
                                <span className="text-red-500 text-sm">Registration number must be exactly 8 digits</span>
                            )}
                        </div>

                        {/* Mobile Number with Validation */}
                        <div className="flex flex-col items-start space-y-1">
                            <label className="text-gray-600 font-semibold capitalize mb-2">Contact No:</label>
                            <input
                                type="text"
                                value={LocalUserInfo.mobNo || ''}
                                readOnly={editField !== 'mobNo'}
                                onChange={(e) =>
                                    setLocalUserInfo((prev) => ({
                                        ...prev,
                                        mobNo: e.target.value.slice(0, 10) // Restrict to 10 characters
                                    }))
                                }
                                className={`w-full text-indigo-600 font-semibold bg-gray-100 rounded-md px-3 py-2 outline-none transition-all duration-300 ${
                                    editField === 'mobNo' ? 'border-indigo-600 text-gray-800' : 'border-transparent cursor-text text-gray-500'
                                }`}
                                placeholder="10-digit Contact Number"
                            />
                            <button
                                onClick={() => handleEdit('mobNo')}
                                className="ml-3 text-gray-500 hover:text-indigo-600"
                                disabled={loading}
                            >
                                {loading && editField === 'mobNo' ? 'Saving...' : editField === 'mobNo' ? <FaSave /> : <FaEdit />}
                            </button>
                            {editField === 'mobNo' && LocalUserInfo.mobNo && LocalUserInfo.mobNo.length !== 10 && (
                                <span className="text-red-500 text-sm">Contact No. must be exactly 10 digits</span>
                            )}
                        </div>
                    </>
                )}
                
                 {/* Faculty-specific fields */}
                {LocalUserInfo.role === 'Faculty' && (
                    <>
                       
                        {/* Department Dropdown */}
                        <div className="flex items-center space-y-1">
                            <label className="text-gray-600 font-semibold capitalize mb-2">Department:</label>
                            <select
                                value={LocalUserInfo.department || ''}
                                onChange={(e) =>
                                    setLocalUserInfo((prev) => ({ ...prev, department: e.target.value }))
                                }
                                disabled={editField !== 'department'}
                                className="text-indigo-600 font-semibold bg-gray-100 rounded-md px-3 py-2 outline-none border-indigo-600"
                            >
                                <option value="">Select Branch</option>
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                <option value="ME">ME</option>
                                {/* Add other branches as options */}
                            </select>
                            <button
                                onClick={() => handleEdit('department')}
                                className="ml-3 text-gray-500 hover:text-indigo-600"
                                disabled={loading}
                            >
                                {loading && editField === 'department' ? 'Saving...' : editField === 'department' ? <FaSave /> : <FaEdit />}
                            </button>
                        </div>

                        {/* FacultyId with Validation */}
                        <div className="flex flex-col items-start space-y-1">
                            <label className="text-gray-600 font-semibold capitalize mb-2">Faculty ID:</label>
                            <input
                                type="text"
                                value={LocalUserInfo.facultyId || ''}
                                readOnly={editField !== 'facultyId'}
                                onChange={(e) =>
                                    setLocalUserInfo((prev) => ({ ...prev, facultyId: e.target.value }))
                                }
                                className={`w-full text-indigo-600 font-semibold bg-gray-100 rounded-md px-3 py-2 outline-none transition-all duration-300 ${
                                    editField === 'facultyId' ? 'border-indigo-600 text-gray-800' : 'border-transparent cursor-text text-gray-500'
                                }`}
                            />
                            <button
                                onClick={() => handleEdit('facultyId')}
                                className="ml-3 text-gray-500 hover:text-indigo-600"
                                disabled={loading}
                            >
                                {loading && editField === 'facultyId' ? 'Saving...' : editField === 'facultyId' ? <FaSave /> : <FaEdit />}
                            </button>
                        </div>

                        {/* Experience */}
                        <div className="flex flex-col items-start space-y-1">
                            <label className="text-gray-600 font-semibold capitalize mb-2">Experience:</label>
                            <input
                                type="text"
                                value={LocalUserInfo.experience || ''}
                                readOnly={editField !== 'experience'}
                                onChange={(e) =>
                                    setLocalUserInfo((prev) => ({ ...prev, experience: e.target.value }))
                                }
                                className={`w-full text-indigo-600 font-semibold bg-gray-100 rounded-md px-3 py-2 outline-none transition-all duration-300 ${
                                    editField === 'experience' ? 'border-indigo-600 text-gray-800' : 'border-transparent cursor-text text-gray-500'
                                }`}
                            />
                            <button
                                onClick={() => handleEdit('experience')}
                                className="ml-3 text-gray-500 hover:text-indigo-600"
                                disabled={loading}
                            >
                                {loading && editField === 'experience' ? 'Saving...' : editField === 'experience' ? <FaSave /> : <FaEdit />}
                            </button>
                        </div>
                        
                        
                    </>
                )}
            </div>
        </div>
    );
}

export default Profile;