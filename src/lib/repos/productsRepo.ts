import axios from "../../appUtils/axiosConfig"
import { cache } from "react";


export async function getProductsData(page: number, limit: number) {
    try {
        const response = await axios.get(`/products/all_products?page=${page}?limit:${limit || 9}&limit=16`);
        return response?.data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
}
//get the  single product data by slug
export const getSinglrProductData = cache(async ({ slug }) => {
    try {
        const response = await axios.get(`/products/product/${slug}`);
        return response?.data;
    } catch (error) {
        // throw Error(error.response.data.message);
        return error.response.status
    }
})


export async function SearchProductsData() {
    try {
        const response = await axios.get(`/products/all_products`);
        return response?.data?.productsdata
    } catch (error) {
        throw Error(error.response.data.message)
    }
}
export async function getShopProductsStatusCount() {
    try {
        const response = await axios.get(`/products/products_status`);
        return response?.data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
}
export async function getShopFilterTypes() {
    try {
        const response = await axios.get(`/filtertypes/types_values`);
        return response?.data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
}