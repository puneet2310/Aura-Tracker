import axios from "axios";
import { toast } from "react-toastify";
import { parseErrorMessage } from "./parseErrorMsg";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: true, //Ensures cookies, including any auth tokens, are sent with each request if needed.
});

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const errorMsg = parseErrorMessage(error.response.data);
        console.log("Error response: ", errorMsg);
        const originalRequest = error.config;
        if (
            error.response.status === 401 &&
            errorMsg === "TokenExpiredError" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refresh_token")?.replace("Bearer ", "");
                if(!refreshToken) return;

                console.log("Refresh token: ", refreshToken);
                // toast.error("Session expired. Please login again!");
                const { data } = await axiosInstance.post(
                    "/users/refresh-token", { refreshToken: refreshToken }
                );
                const accessToken = `Bearer ${data.data.accessToken}`; 
                localStorage.setItem("access_token", accessToken);
                axiosInstance.defaults.headers.common[
                    "Authorization"
                ] = accessToken;
                return axiosInstance(originalRequest);
            } catch (err) {
                console.error("Failed to refresh token", err);
                localStorage.removeItem("access_token");
                // window.location.reload();
                toast.error("Session expired. Please login again!");
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;