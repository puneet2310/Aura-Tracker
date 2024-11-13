import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Logo";
import Input from "../Input";
import Button from "../Button";
import { toast } from "react-toastify";
import { icons } from "../../assets/Icons.jsx";
import axiosInstance from "../../utils/axios.helper.js";
import { useDispatch, useSelector } from "react-redux";
import { addUserAcadGoals } from "../../store/userSlice.js";

function SetAcademicGoals() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData);
    console.log("userData", userData);

    const setAcadGoals = async (data) => {
        try {
            setLoading(true);
            const response = await axiosInstance.post("/acadGoals/set-acad-goals", data);
            dispatch(addUserAcadGoals(response.data.data));
            toast.success("Academic goal created successfully!");

            const allGoals = await axiosInstance.get("/acadGoals/get-acad-goals");
            const currDate = new Date();

            const updatedGoals = await Promise.all(
                allGoals.data.data.map(async (goal) => {
                    const goalDueDate = new Date(goal.targetDate);
                    if (currDate > goalDueDate && goal.status !== 'Completed') {
                        goal.status = 'Missed';
                        await axiosInstance.put('/acadGoals/update-acad-goal', goal);
                    }
                    return goal;
                })
            );

            navigate("/dashboard/view-acad-goals");
        } catch (err) {
            setError(err.message || "Failed to create goal.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <div className="flex justify-center mb-6">
                    <Link to="/">
                        <Logo width="76" />
                    </Link>
                </div>
                <h2 className="text-2xl font-semibold text-center mb-4">Set Academic Goals</h2>
                {error && (
                    <p className="text-red-600 mb-4 text-center">{error}</p>
                )}
                <form onSubmit={handleSubmit(setAcadGoals)}>
                    <Input
                        label="Title"
                        required
                        className="mb-4"
                        placeholder="Enter goal title"
                        {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && (
                        <p className="text-red-600 mb-2">
                            {errors.title.message}
                        </p>
                    )}

                    <Input
                        label="Description"
                        required
                        className="mb-4"
                        placeholder="Describe your goal"
                        {...register("description", { required: "Description is required" })}
                    />
                    {errors.description && (
                        <p className="text-red-600 mb-2">
                            {errors.description.message}
                        </p>
                    )}

                    <Input
                        label="Target Date"
                        type="date"
                        required
                        className="mb-4"
                        {...register("targetDate", { required: "Target date is required" })}
                    />
                    {errors.targetDate && (
                        <p className="text-red-600 mb-2">
                            {errors.targetDate.message}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 rounded-lg"
                        bgColor={loading ? "bg-indigo-800" : "bg-indigo-600"}
                    >
                        {loading ? <span>{icons.loading}</span> : "Save Goal"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default SetAcademicGoals;
