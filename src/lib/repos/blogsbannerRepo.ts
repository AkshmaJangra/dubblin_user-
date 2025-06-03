import axios from "../../appUtils/axiosConfig"
import { cache } from "react";


export async function getblogsbanner() {
    try {
        const response = await axios.get('/blogsbanner/get');
        return response?.data?.blogsbannerData[0];
    } catch (error) {
        throw Error(error.response.data.message);
    }
}