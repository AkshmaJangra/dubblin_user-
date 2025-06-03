import axios from "../../appUtils/axiosConfig"
import { cache } from "react";


export async function getblogspost() {
    try {
        const response = await axios.get('/blogspost/all');
        return response?.data?.blogspostData;
    } catch (error) {
        throw Error(error.response.data.message);
    }
}