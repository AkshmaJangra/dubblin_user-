import axiosLib from "axios";
import { getCurrentUser } from "./getCurrentUser";
import { signOut } from "next-auth/react";

const axios = axiosLib.create({
    baseURL: `${process.env.NEXT_PUBLIC_APP_API_URL}/api/v1/`,
});

axios.interceptors.request.use(async (config) => {
    const user = await getCurrentUser();
    let token = user?.accessToken;
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers["Authorization"] = `Bearer ${token}`;
    // }
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});
// 🔹 Handle Token Expiry (Logout User if Backend Rejects Token)
// 🔹 Check for token expiration only if the token is present in the session
const checkTokenExpiration = async () => {
    const user = await getCurrentUser();
    const token = user?.accessToken;

    if (token) {
        axios.interceptors.response.use(
            (response) => response, // Pass successful responses
            async (error) => {
                if (error.response?.status === 401) {
                    console.error("Token expired or invalid. Logging out...");
                    await signOut(); // Auto-logout the user
                    return Promise.reject(error);
                }
                return Promise.reject(error);
            }
        );
    }
};

// checkTokenExpiration();
export default axios;
