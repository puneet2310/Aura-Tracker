import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Logo";
import Input from "../Input";
import Button from "../Button";
import { toast } from "react-toastify";
import { icons } from "../../assets/Icons.jsx";
import axiosInstance from "../../utils/axios.helper.js";
import { useDispatch } from "react-redux";
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

    const setAcadGoals = async (data) => {
        // console.log(data)
        try {
            setLoading(true);
            const response = await axiosInstance.post("/acadGoals/set-acad-goals", data);
            console.log(response.data.data);
            // dispatch(addUserAcadGoals(response.data.data))

            dispatch(addUserAcadGoals(response.data.data));
            toast.success("Academic goal created successfully!");

            const allGoals = await axiosInstance.get("/acadGoals/get-acad-goals");
            console.log("All goals are: ", allGoals);
        
            const currDate = new Date();
            console.log("Current Date:", currDate);
        
            // Update goals if past target date
            const updatedGoals = await Promise.all(
                allGoals.data.data.map(async (goal) => {
                console.log("Goal:", goal);
                const goalDueDate = new Date(goal.targetDate);
                if (currDate > goalDueDate && goal.status !== 'Completed') {
                    goal.status = 'Missed';
                    const updateStatus = await axiosInstance.put('/acadGoals/update-acad-goal', goal);
                    console.log("Updated Status for Goal:", updateStatus);
                }
                return goal;
                })
            );
        
            console.log("Updated goals are:", updatedGoals);
            
            navigate("/")
            
        } catch (err) {
            setError(err.message || "Failed to create goal.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto my-10 flex w-full max-w-sm flex-col px-4">
            <div className="mx-auto inline-block">
                <Link to="/">
                    <Logo width="76" />
                </Link>
            </div>
            <div className="my-4 w-full text-center text-xl font-semibold">
                Set Academic Goals
            </div>
            {error && (
                <p className="text-red-600 mt-8 text-center">{error}</p>
            )}
            <form
                onSubmit={handleSubmit(setAcadGoals)}
                className="mx-auto mt-2 flex w-full max-w-sm flex-col px-4"
            >
                <Input
                    label="Title"
                    required
                    className="px-2 rounded-lg"
                    placeholder="Enter goal title"
                    {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                    <p className="text-red-600 px-2 mt-1">
                        {errors.title.message}
                    </p>
                )}

                <Input
                    label="Description"
                    required
                    className="px-2 rounded-lg"
                    placeholder="Describe your goal"
                    {...register("description", { required: "Description is required" })}
                />
                {errors.description && (
                    <p className="text-red-600 px-2 mt-1">
                        {errors.description.message}
                    </p>
                )}

                <Input
                    label="Target Date"
                    type="date"
                    required
                    className="px-2 rounded-lg"
                    {...register("targetDate", { required: "Target date is required" })}
                />
                {errors.targetDate && (
                    <p className="text-red-600 px-2 mt-1">
                        {errors.targetDate.message}
                    </p>
                )}


                <Button
                    type="submit"
                    disabled={loading}
                    className="mt-5 disabled:cursor-not-allowed py-2 rounded-lg"
                    bgColor={loading ? "bg-blue-800" : "bg-blue-600"}
                >
                    {loading ? <span>{icons.loading}</span> : "Save Goal"}
                </Button>
            </form>
        </div>
    );
}

export default SetAcademicGoals;
