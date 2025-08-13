import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../../utils/axios.helper.js";
import { toast } from "react-toastify";

import Logo from "../Logo";
import Input from "../Input";
import Button from "../Button";
import GoogleLogin from "./GoogleLogin.jsx";

import { login as authLogin } from "../../store/authSlice";
import { addUser, addUserAcadGoals } from "../../store/userSlice.js";
import { icons } from "../../assets/Icons.jsx";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const signup = async (data) => {
    setError("");
    setLoading(true);

    // build FormData
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    if (data.avatar && data.avatar.length) {
      formData.append("avatar", data.avatar[0]);
    }

    try {
      const response = await axiosInstance.post("/users/register", formData);

      // our new controller returns { user, accessToken, refreshToken } in response.data.data
      const payload = response?.data?.data;
      if (payload?.user) {
        const { user, accessToken, refreshToken } = payload;

        // 1) Redux: store user in auth & user slices
        dispatch(authLogin(user));
        dispatch(addUser(user));
        // if you need academicaura or goals:
        if (user.academicGoals) {
          dispatch(addUserAcadGoals(user.academicGoals));
        }

        // 2) Persist tokens in localStorage & set axios header
        const bearerAT = `Bearer ${accessToken}`;
        const bearerRT = `Bearer ${refreshToken}`;
        localStorage.setItem("access_token", bearerAT);
        localStorage.setItem("refresh_token", bearerRT);
        axiosInstance.defaults.headers.common["Authorization"] = bearerAT;

        // 3) Notify + redirect into app
        toast.success("Welcome aboard, " + user.fullName + "!");
        navigate("/");  
      } else {
        throw new Error("Unexpected signup response");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setError("A user with that email or username already exists");
      } else {
        setError("Signup failed. Please try again.");
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
            Already have an account?{" "}
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
            {...register("fullName", { required: "Full name is required" })}
          />
          {errors.fullName && (
            <p className="text-red-600">{errors.fullName.message}</p>
          )}

          <Input
            label="Username"
            required
            placeholder="Choose your username"
            {...register("userName", { required: "Username is required" })}
          />
          {errors.userName && (
            <p className="text-red-600">{errors.userName.message}</p>
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
                message: "Enter a valid email address",
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
              required: "Password is required",
              minLength: { value: 8, message: "At least 8 characters" },
              maxLength: { value: 20, message: "At most 20 characters" },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
                message:
                  "Must contain uppercase, lowercase & a digit",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-600">{errors.password.message}</p>
          )}

          <Input
            label="Avatar"
            type="file"
            {...register("avatar", {
              validate: (file) => {
                if (!file.length) return true;
                const allowed = ["image/jpeg", "image/png", "image/jpg"];
                return allowed.includes(file[0].type) ||
                  "Only .jpg, .jpeg, .png allowed";
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