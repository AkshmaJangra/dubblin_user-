import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

import { toast } from 'sonner';
// import axios from 'axios';
import axios from "../../appUtils/axiosConfig"

type BaseModel = {
    id: string;
    createdAt: string;
    updatedAt: string;
};

type BaseState<T> = {
    data: T;
    loading: boolean;
    error: string | null;
};


export type IProducts = BaseModel & {
    logo: string;
    favicon: string;
    meta_title: string;
    meta_tag: string;
    meta_description: string;
    copyright: string;
};

const initialState = {
    productsState: {
        data: [], // Initial data as an empty array
        loading: false, // Represents whether the API call is in progress
        error: null // Stores any errors from API calls
    } as BaseState<IProducts[]>, // The state type is BaseState with an array of IProducts as the data type
    productsShopState: {
        data: [], // Initial data as an empty array
        loading: false, // Represents whether the API call is in progress
        error: null // Stores any errors from API calls
    } as BaseState<IProducts[]>, // The state type is BaseState with an array of IProducts as the data type
    relatedProductsState: {
        data: [], // Initial data as an empty array
        loading: false, // Represents whether the API call is in progress
        error: null // Stores any errors from API calls
    } as BaseState<IProducts[]> // The state type is BaseState with an array of IProducts as the data type
};

export const fetchProductsData = createAsyncThunk<any, { search?: string, limit?: number, categoryId?: string }, { state: RootState }>(
    'products/fetchData',
    async ({ search, limit, categoryId }, { dispatch, rejectWithValue }) => {
        try {
            // Use a generic start action or create a new one
            dispatch(fetchProductsStart());
            const response = await axios.get(`/products/all_products?limit=${limit || 8}&searchKey=${search?.toString()}&categoryId=${categoryId || ''}`);
            dispatch(fetchProductsSuccess(response?.data))
            return response?.data;

        } catch (error: any) {
            const errorMsg = error?.message || 'Something Went Wrong';
            dispatch(fetchProductsFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);
let controller = new AbortController();
let requestPending = false;

export const fetchShopProductsData = createAsyncThunk<any, { selectedCategories?: any[], limit?: number, page?: number, selectedColors?: any[], selectedSizes?: any[], priceRange?: any[], sortOption: string, bestSelling: boolean, sale: boolean }, { state: RootState }>(
    'products/shop_products',
    async ({ selectedCategories, limit, page, selectedSizes, selectedColors, priceRange, sortOption, bestSelling, sale }, { dispatch, rejectWithValue }) => {
        try {
            // Use a generic start action or create a new one
            dispatch(fetchShopProductsStart());
            if (requestPending) {
                controller.abort()
                controller = new AbortController();
            }
            requestPending = true;
            const response = await axios.post(`/products/shop_products`, {
                selectedCategories, limit, page, selectedSizes, selectedColors, priceRange, sortOption, bestSelling, sale
            }, { signal: controller.signal });
            requestPending = false;
            dispatch(fetchShopProductsSuccess(response?.data))
            return response?.data;

        } catch (error: any) {
            const errorMsg = error?.message || 'Something Went Wrong';
            dispatch(fetchShopProductsFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);

export const fetchRelatedProductsData = createAsyncThunk<any, { categoryIds?: string }, { state: RootState }>(
    'relatedproducts/fetchData',
    async ({ categoryIds }, { dispatch, rejectWithValue }) => {
        try {
            // Use a generic start action or create a new one
            dispatch(fetchRelatedProductsStart());
            const response = await axios.get(`/products/related_products?category=${categoryIds}`);
            dispatch(fetchRelatedProductsSuccess(response?.data))
            return response?.data;

        } catch (error: any) {
            const errorMsg = error?.message || 'Something Went Wrong';
            dispatch(fetchRelatedProductsFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {

        fetchProductsStart(state) {
            state.productsState.loading = true;
            state.productsState.error = null;
        },
        fetchProductsSuccess(state, action) {
            state.productsState.loading = false;
            state.productsState.data = action.payload;
            state.productsState.error = null;
        },
        fetchProductsFailure(state, action) {
            state.productsState.loading = false;
            state.productsState.error = action.payload;
        },
        fetchRelatedProductsStart(state) {
            state.relatedProductsState.loading = true;
            state.relatedProductsState.error = null;
        },
        fetchRelatedProductsSuccess(state, action) {
            state.relatedProductsState.loading = false;
            state.relatedProductsState.data = action.payload;
            state.relatedProductsState.error = null;
        },
        fetchRelatedProductsFailure(state, action) {
            state.relatedProductsState.loading = false;
            state.relatedProductsState.error = action.payload;
        },
        fetchShopProductsStart(state) {
            state.productsShopState.loading = true;
            state.productsShopState.error = null;
        },
        fetchShopProductsSuccess(state, action) {
            state.productsShopState.loading = false;
            state.productsShopState.data = action.payload;
            state.productsShopState.error = null;
        },
        fetchShopProductsFailure(state, action) {
            state.productsShopState.loading = false;
            state.productsShopState.error = action.payload;
        },
    }
});

export const {
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsFailure,
    fetchRelatedProductsStart,
    fetchRelatedProductsSuccess,
    fetchRelatedProductsFailure,
    fetchShopProductsStart,
    fetchShopProductsSuccess,
    fetchShopProductsFailure,
} = productsSlice.actions;

export default productsSlice.reducer;
