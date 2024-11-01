import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios.helper.js";
import { login as authLogin } from "../store/authSlice";
import { toast } from "react-toastify";
import GoogleButton from "react-google-button";
import Button from "./Button.jsx";
import { icons } from "../assets/Icons.jsx";
function GoogleLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const responseGoogle = async (response) => {
        setLoading(true);
        try {
            if (response.code) {

                // console.log("Response from client: ",response)
                const result = await axiosInstance.get(`/users/google?code=${response.code}`);
                // console.log("Result from server: ",result)
                if (result?.data?.data) {
                    dispatch(authLogin(result.data.data.user));

                    const accessToken = `Bearer ${result.data.data.accessToken}`;
                    localStorage.setItem("access_token", accessToken);
                    axiosInstance.defaults.headers.common["Authorization"] = accessToken;

                    toast.success("Login successfully");
                    navigate("/");
                }
            }
        } catch (error) {
            console.error("Error while requesting Google code", error);
            toast.error("Google login failed.");
            setLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: "auth-code",
    });

    return (
        <Button
            className="flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-indigo-800 transition-colors min-w-80"
            onClick={googleLogin}
            aria-label="Sign up with Google"
        >
            {loading ? (
                <span>{icons.loading}</span> 
            ) : (
                <>
                    <img
                        src="https://e7.pngegg.com/pngimages/715/371/png-clipart-youtube-google-logo-google-s-google-account-youtube-text-trademark.png"
                        alt="Google Logo"
                        className="mr-2 bg-white rounded-full w-6 h-6"
                    />
                    <span className="text-white">Sign Up with Google</span>
                </>
            )}
        </Button>
    );
}

export default GoogleLogin;
