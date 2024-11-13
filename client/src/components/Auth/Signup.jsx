import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios.helper.js";
import Logo from "../Logo";
import Input from "../Input";
import Button from "../Button";
import { toast } from "react-toastify";
import { icons } from "../../assets/Icons.jsx";
import GoogleLogin from "./GoogleLogin.jsx";

function SignUp() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const signup = async (data) => {
        console.log(data);
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        formData.append("avatar", data.avatar[0]);
        setError("");
        setLoading(true);
        console.log("Data is : ", formData);
        try {
            const response = await axiosInstance.post("/users/register", formData);
            if (response?.data?.data) {
                toast.success("Account created successfully 🥳");
                navigate("/login");
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setError("User with email or username already exists");
            } else {
                console.log(error);
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                <div className="text-center mb-4">
                    <div className="flex justify-center mb-4">
                        <Link to="/">
                            <Logo width="76" />
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold mt-2">Create an Account</h1>
                    <h6 className="mt-1">
                        Already have an Account?{" "}
                        <Link to="/login" className="text-indigo-600 hover:underline">
                            Sign in now
                        </Link>
                    </h6>
                </div>
                {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit(signup)} className="flex flex-col space-y-4">
                    <Input
                        label="Full Name"
                        required
                        placeholder="Enter your full name"
                        {...register("fullName", { required: true })}
                    />
                    {errors.fullName?.type === "required" && (
                        <p className="text-red-600">Full name is required</p>
                    )}
                    <Input
                        label="Username"
                        required
                        placeholder="Choose your username"
                        {...register("userName", { required: true })}
                    />
                    {errors.userName?.type === "required" && (
                        <p className="text-red-600">Username is required</p>
                    )}
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email address"
                        required
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                message: "Email address must be a valid address",
                            },
                        })}
                    />
                    {errors.email && (
                        <p className="text-red-600">{errors.email.message}</p>
                    )}
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Create your password"
                        required
                        {...register("password", {
                            required: true,
                            minLength: {
                                value: 8, // Minimum length for the password
                                message: "Password must be at least 8 characters long" // Error message for minimum length
                            },
                            maxLength: {
                                value: 20, // Maximum length for the password
                                message: "Password cannot exceed 20 characters" // Error message for maximum length
                            },
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/, // Regex pattern: At least one uppercase letter, one lowercase letter, and one digit
                                message: "Password must contain at least one uppercase letter, one lowercase letter, and one digit" // Error message for pattern mismatch
                            }
                        })}
                        />
                        {errors.password?.type === "required" && (
                            <p className="text-red-600">Password is required</p>
                        )}
                        {errors.password?.type === "minLength" && (
                            <p className="text-red-600">{errors.password.message}</p>
                        )}
                        {errors.password?.type === "maxLength" && (
                            <p className="text-red-600">{errors.password.message}</p>
                        )}
                        {errors.password?.type === "pattern" && (
                            <p className="text-red-600">{errors.password.message}</p>
                        )}
                    <Input
                        label="Avatar"
                        type="file"
                        required
                        {...register("avatar", {
                            required: false,
                            validate: (file) => {
                                const allowedExtensions = [
                                    "image/jpeg",
                                    "image/png",
                                    "image/jpg",
                                ];
                                const fileType = file[0]?.type;
                                return allowedExtensions.includes(fileType)
                                    ? true
                                    : "Invalid file type! Only .png, .jpg, and .jpeg files are accepted";
                            },
                        })}
                    />
                    {errors.avatar && (
                        <p className="text-red-600">{errors.avatar.message}</p>
                    )}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="py-2 rounded-lg"
                        bgColor={loading ? "bg-indigo-800" : "bg-indigo-600"}
                    >
                        {loading ? <span>{icons.loading}</span> : "Sign Up"}
                    </Button>
                </form>
                <div className="flex items-center justify-center gap-2 mt-5">
                    <GoogleLogin />
                </div>
            </div>
        </div>
    );
}

export default SignUp;
