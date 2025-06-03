import axios from "../../appUtils/axiosConfig"
import { cache } from "react";

export async function getCategoriesData({ show_in_home, limit, show_in_menu, child }) {
    try {
        const response = await axios.get(`/category/all_categories?show_in_home=${show_in_home}&show_in_menu=${show_in_menu}&limit=${limit}&child=${child}`);

        return response?.data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
}
//get catgories to show in Shop page

export async function getShopCategoriesData() {
    try {
        // const response = await axios.get(`/category/shop_categories?limit=${limit}&child=${child}`);
        const response = await axios.get(`/category/all_categories_tree`);
        return response?.data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
}
//get catgories to show in home
export async function getHomeCategoriesData() {
    try {
        const response = await axios.get('/category/home_categories?show_in_home=true');
        return response?.data
    } catch (error) {
        throw Error(error.response.data.message);
    }
}
//get the  single categories banner title and description by slug
export const getCategoryBySlug = cache(async (category: any) => {
    try {
        const response = await axios.get(`/category/category_by_slug/${category}`);
        return response?.data;
    } catch (error) {
        // throw Error(error.response.data.message);
        return error.response.status
    }
})

