import axios from "../../appUtils/axiosConfig"
import { cache } from "react";


export async function getReels() {
    try {
        const response = await axios.get('/instagram/get/reels');
        // console.log("response of reels", response.data.data);
        return response?.data?.data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
}