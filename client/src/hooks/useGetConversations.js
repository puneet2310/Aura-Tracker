import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axios.helper";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);

	useEffect(() => {

		const getConversations = async () => {
			setLoading(true);
			try {
				const res = await axiosInstance.get("/getUsers");
				setConversations(res?.data?.data);
				console.log(res?.data.data)
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	return { loading, conversations };
};
export default useGetConversations;