import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from '../store/authSlice';
import { addUser, addUserAcadGoals } from '../store/userSlice.js';
import { Button, Input, Logo } from './index';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import axiosInstance from '../utils/axios.helper';
import { toast } from 'react-toastify';
import { icons } from '../assets/Icons.jsx';
import GoogleLogin from './GoogleLogin.jsx';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm();

    const login = async (data) => {
        setError('');
        setLoading(true);
        try {
            const response = await axiosInstance.post('/users/login', data);
            const user = response?.data?.data?.user;
            const accessToken = `Bearer ${response.data.data.accessToken}`;
            
            if (user) {
                dispatch(authLogin(user));
                localStorage.setItem('access_token', accessToken);
                axiosInstance.defaults.headers.common['Authorization'] = accessToken;
                
                toast.success('Login successful');
                navigate('/');
            }
        } catch (error) {
            const status = error.response?.status;
            if (status === 401) {
                setError('Invalid password');
            } else if (status === 500) {
                setError('Server is not working');
            } else if (status === 404) {
                setError('User does not exist');
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-10 border border-gray-200">
                <div className="mb-6 flex justify-center">
                    <Logo width="80px" />
                </div>
                <h2 className="text-center text-3xl font-semibold text-gray-800">
                    Sign in to Pro-Track
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="font-semibold text-indigo-600 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && (
                    <p className="text-center text-red-500 mt-4">{error}</p>
                )}
                <form
                    onSubmit={handleSubmit(login)}
                    className="mx-auto mt-6 flex w-full max-w-sm flex-col space-y-5"
                >
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        {...register("userName", {
                            required: "Email is required",
                            validate: {
                                matchPattern: (value) =>
                                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    "Invalid email address",
                            },
                        })}
                    />
                    {errors.userName && (
                        <p className="text-red-500 text-sm px-2 mt-1">{errors.userName.message}</p>
                    )}
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters",
                            },
                            maxLength: {
                                value: 20,
                                message: "Password must be less than 20 characters",
                            },
                            validate: {
                                matchPattern: (value) =>
                                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
                                        value
                                    ) ||
                                    "Password must contain uppercase, lowercase, number, and special character",
                            },
                        })}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm px-2 mt-1">{errors.password.message}</p>
                    )}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 mt-6 rounded-lg text-white font-bold transition-all duration-200 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                        {loading ? <span>{icons.loading}</span> : "Sign in"}
                    </Button>
                </form>
                <div className="flex items-center justify-center gap-4 mt-8">
                    <GoogleLogin />
                </div>
            </div>
        </div>
    );
}

export default Login;
