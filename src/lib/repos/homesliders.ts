import axios from "../../appUtils/axiosConfig"
import { cache } from "react";


export async function getHomeSliders() {
    try {
        const response = await axios.get('/sliders/foruser');
        return response?.data?.SlidersData;
    } catch (error) {
        throw Error(error.response.data.message);
    }
}
export async function getHomeCategories() {
    try {
        const response = await axios.get(`/home_categories/getforuser`);
        return response.data?.homeCategories[0]
    }
    catch (error) {
        throw Error(error?.response?.data?.message)
    }
}

export async function getNewArrivals() {
    try {
        const response = await axios.get(`/new_arrival/get`)
        return response?.data?.newArrivals[0]
    }
    catch (error) {
        throw Error(error?.response?.data?.message)
    }
}