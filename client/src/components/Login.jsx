import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {login as authLogin} from '../store/authSlice'   
import {Button, Input, Logo} from "./index"
import {useDispatch} from 'react-redux'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-toastify'
import axiosInstance from '../utils/axios.helper'
import { icons } from "../assets/Icons.jsx";
import GoogleLogin from './GoogleLogin.jsx'

function Login() {
    console.log("here in login")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [error, setError] = useState('')

    const login = async (data) => {
        console.log(data)
        setError('') //clear error while submitting form
        setLoading(true)
        try {

            const response = await axiosInstance.post('/users/login', data)
            console.log(response)

            if(response?.data?.data) {
                console.log(response.data.data.user)
                dispatch(authLogin(response.data.data.user))
                
                const accessToken = `Bearer ${response.data.data.accessToken}`; // Add "Bearer" here

                localStorage.setItem(
                    'access_token',
                    accessToken
                );
                
                axiosInstance.defaults.headers.common['Authorization'] = accessToken;

                toast.success('Login successfully')
                navigate('/')
            }

            
            
        } catch (error) {
            if (error.status === 401) {
                setError("Invalid password");
            } else if (error.status === 500) {
                setError("Server is not working");
            } else if (error.status === 404) {
                setError("User does not exist");
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        } 
    }    

  return (
    <div
    className='flex items-center justify-center w-full'>
        <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
        >
            <div className="mb-2 flex justify-center">
                <span className="inline-block w-full max-w-[100px]">
                    <Logo width="100%" />
                </span>
            </div>
            <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
            <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
            </p>
            {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}

            {/*handlesubmit  ek (event) method hai jo mera method lega jo mera form submit krega*/}
            <form 
            onSubmit={handleSubmit(login)}
            className='mx-auto mt-2 flex w-full max-w-sm flex-col px-4'>
                <div className="space-y-5">
                    <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("userName", {
                        required: true,
                        validate: {
                            matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be a valid address",
                        }

                    })} // it is compulsory because we are using useForm hook , if you are not using this then tm agr kisi aur input field me register use kroge to overwrite ho jayegi cheeze
                    />
                    {errors.email && (
                        <p className="text-red-600 px-2 mt-1">
                            {errors.email.message}
                        </p>
                    )}
                    {errors.email?.type === "required" && (
                        <p className="text-red-600 px-2 mt-1">
                            Email is required
                        </p>
                    )}
                    <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password", {
                        required: true,
                        minLength: 6,
                        maxLength: 20,
                        validate: {
                            matchPatern: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(value) || "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                        }
                    })}
                    />
                    {errors.password?.type === "required" && (
                        <p className="text-red-600 px-2 mt-1">
                            Password is required
                        </p>
                    )}
                    <div className='flex items-center justify-center'>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="min-w-80 mt-5 disabled:cursor-not-allowed py-2 rounded-lg"
                            bgColor={loading ? "bg-blue-800" : "bg-blue-600"}
                        >
                            {loading ? <span>{icons.loading}</span> : "Sign in"}
                        </Button>
                    </div>
                </div>
            </form>
            <div className="flex items-center justify-center gap-2 mt-5"> 
                <GoogleLogin/>
            </div>
        </div>
    </div>
  )
}

export default Login