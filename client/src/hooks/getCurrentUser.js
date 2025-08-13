import axiosInstance from "../utils/axios.helper";
import { login as authLogin, logout as authLogout } from "../store/authSlice";

export const getCurrentUser = async (dispatch) => {
    try {
        const response = await axiosInstance.get("/users/current-user");
        console.log("Current user response: ", response);
        if (response?.data?.data) {
            dispatch(authLogin(response.data.data));
            return response.data;
        }
    } catch (error) {
        console.log("Error fetching current user: ", error);
    }
};