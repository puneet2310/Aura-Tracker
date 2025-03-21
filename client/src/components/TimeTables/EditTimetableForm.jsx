import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Button from "../Button"; 
import Input from "../Input";   
import axiosInstance from "../../utils/axios.helper";
import { toast } from "react-toastify";

const EditTimetableForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [semester, setSemester] = useState("");
    const [stream, setStream] = useState("");

    // const streams = ["CSE", "ECE", "ME", "CE", "EEE"];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosInstance.get('/student/get-profile')
            console.log(response)
            setSemester(response.data.data.student.semester)
            setStream(response.data.data.student.stream)
        }
        fetchData()
    }, [])

    const onSubmit = async (data) => {
        setLoading(true);
        setError("");

        console.log(data);

        try {
            const response = await axiosInstance.post(
                `/timetable/edit/${stream}/${semester}`,
                data
            );
            console.log("Response:", response.data);

            if (response.status === 200) {
                toast.success("Timetable updated successfully!");
            } else {
                setError("Failed to update the timetable.");
            }
        } catch (err) {
            setError("An error occurred while updating the timetable.");
            console.error("Error updating timetable:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-4">Edit Timetable</h2>
                
                {error && (
                    <p className="text-red-600 mb-4 text-center">{error}</p>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Semester (Non-editable) */}
                    <label className="block text-gray-700 font-medium mb-2">Semester</label>
                    <input
                        type="text"
                        value={semester}
                        readOnly
                        className="mb-4 block w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-700 cursor-not-allowed"
                    />

                    {/* Stream (Non-editable) */}
                    <label className="block text-gray-700 font-medium mb-2">Stream</label>
                    <input
                        type="text"
                        value={stream}
                        readOnly
                        className="mb-4 block w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-700 cursor-not-allowed"
                    />

                    {/* Day Selection */}
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="day">Day</label>
                    <select
                        id="day"
                        className="block w-full p-2 border border-gray-300 rounded-lg mb-4"
                        {...register("day", { required: "Day is required" })}
                    >
                        <option value="">Select Day</option>
                        {days.map((day, index) => (
                            <option key={index} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>
                    {errors.day && (
                        <p className="text-red-600 mb-2">{errors.day.message}</p>
                    )}

                    <Input
                        label="Subject"
                        placeholder="Enter subject"
                        required
                        className="mb-4"
                        {...register("subject", { required: "Subject is required" })}
                    />
                    {errors.subject && (
                        <p className="text-red-600 mb-2">{errors.subject.message}</p>
                    )}

                    <Input
                        label="Instructor"
                        placeholder="Enter instructor"
                        required
                        className="mb-4"
                        {...register("instructor", { required: "Instructor is required" })}
                    />
                    {errors.instructor && (
                        <p className="text-red-600 mb-2">{errors.instructor.message}</p>
                    )}

                    <Input
                        label="Start Time"
                        type="time"
                        required
                        className="mb-4"
                        {...register("startTime", { required: "Start time is required" })}
                        min="09:00"
                        max="18:00"
                        step="3600"  // 1-hour intervals
                    />
                    {errors.startTime && (
                        <p className="text-red-600 mb-2">{errors.startTime.message}</p>
                    )}

                    <Input
                        label="End Time"
                        type="time"
                        required
                        className="mb-4"
                        {...register("endTime", { required: "End time is required" })}
                        min="09:00"
                        max="18:00"
                        step="3600"  // 1-hour intervals
                    />
                    {errors.endTime && (
                        <p className="text-red-600 mb-2">{errors.endTime.message}</p>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 mt-4 rounded-lg"
                        bgColor={loading ? "bg-indigo-800" : "bg-indigo-600"}
                    >
                        {loading ? "Updating..." : "Update Timetable"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default EditTimetableForm;
