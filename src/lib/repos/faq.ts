import axios from "../../appUtils/axiosConfig"
import { cache } from "react";


export async function getFaq() {
    try {
        const response = await axios.get('/faq/all_faq');
        return response?.data?.FaqData;
    } catch (error) {
        throw Error(error.response.data.message);
    }
}