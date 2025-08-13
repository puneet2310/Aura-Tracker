import axios from "axios";
import { toast } from "react-toastify";
import { parseErrorMessage } from "./parseErrorMsg";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Ensures cookies are sent with each request
});

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errorMsg = parseErrorMessage(error.response?.data || {});
    console.log("Error response: ", errorMsg);
    const originalRequest = error.config;

    // Only try refresh once, and skip refresh endpoint itself
    if (
      error.response?.status === 401 &&
      errorMsg === "TokenExpiredError" &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh-token")
    ) {
      originalRequest._retry = true;
      try {
        // Request a new access token via refresh API (cookie-based)
        await axiosInstance.post("/users/refresh-token");

        // After successful refresh, read new token from storage
        const newAccess = localStorage.getItem("access_token");
        if (newAccess) {
          axiosInstance.defaults.headers.common["Authorization"] = newAccess;
        }

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token", refreshError);
        localStorage.removeItem("access_token");
        toast.error("Session expired. Please login again!");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;