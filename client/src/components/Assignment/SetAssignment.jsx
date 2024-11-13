import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Logo";
import Input from "../Input";
import Button from "../Button";
import { toast } from "react-toastify";
import { icons } from "../../assets/Icons.jsx";
import axiosInstance from "../../utils/axios.helper.js";
import { useDispatch } from "react-redux";
// import { addAssignment } from "../../store/assignmentSlice.js";

function AssignmentSubmitForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('')
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const subjects = ['Analysis of Algorithms', 'Automata', 'OOPs']

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/faculty/get-profile")
                setSelectedDepartment(response.data.data.faculty.department)
            } catch (error) {
                console.log("error", error)
            }
        }
        fetchData()
    }, []);

    const submitAssignment = async (data) => {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        formData.append("file", data.file[0]);
        formData.append("semester", selectedSemester);
        formData.append("subject", selectedSubject);
        formData.append("department", selectedDepartment);
        setError("");
        setLoading(true);
        try {
            const response = await axiosInstance.post("/assignment/upload", formData);
            toast.success("Assignment submitted successfully!");

            navigate("/dashboard")
        } catch (err) {
            setError(err.message || "Failed to submit assignment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center mt-8 mb-6  px-4 bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg ">
                <div className="flex justify-center mb-6">
                    <Link to="/">
                        <Logo width="76" />
                    </Link>
                </div>
                <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Upload Assignment</h2>
                {error && (
                    <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
                )}
                <form onSubmit={handleSubmit(submitAssignment)} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Semester</label>
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className="block w-full px-4 py-2 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            required
                        >
                            <option value="">Select Semester</option>
                            {Array.from({ length: 8 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Subject</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="block w-full px-4 py-2 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            required
                        >
                            <option value="">Select a Subject</option>
                            {subjects.map((subject) => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Title"
                        required
                        className="mb-4"
                        placeholder="Enter assignment title"
                        {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && (
                        <p className="text-red-600 mb-2 text-sm">{errors.title.message}</p>
                    )}

                    <Input
                        label="Description"
                        required
                        className="mb-4"
                        placeholder="Describe the assignment"
                        {...register("description", { required: "Description is required" })}
                    />
                    {errors.description && (
                        <p className="text-red-600 mb-2 text-sm">{errors.description.message}</p>
                    )}

                    <Input
                        label="Due Date"
                        type="date"
                        required
                        className="mb-4"
                        {...register("dueDate", { required: "Due date is required" })}
                    />
                    {errors.dueDate && (
                        <p className="text-red-600 mb-2 text-sm">{errors.dueDate.message}</p>
                    )}

                    <Input
                        label="File Upload"
                        type="file"
                        className="mb-4"
                        {...register("file", { required: "File upload is required" })}
                    />
                    {errors.file && (
                        <p className="text-red-600 mb-2 text-sm">{errors.file.message}</p>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 rounded-lg text-white transition-all duration-300 hover:bg-indigo-700 transform hover:scale-105"
                        bgColor={loading ? "bg-indigo-800" : "bg-indigo-600"}
                    >
                        {loading ? <span>{icons.loading}</span> : "Upload Assignment"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default AssignmentSubmitForm;
