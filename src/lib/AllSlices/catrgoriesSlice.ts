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


export type ICategories = BaseModel & {
    logo: string;
    favicon: string;
    meta_title: string;
    meta_tag: string;
    meta_description: string;
    copyright: string;
};

const initialState = {
    categoriesState: {
        data: {}, // Initial description as an empty string
        loading: false, // Represents whether the API call is in progress
        error: null // Stores any errors from API calls
    } as BaseState<ICategories>,// The state type is BaseState with a string as the data type
    categoriesTreeState: {
        data: {}, // Initial description as an empty string
        loading: false, // Represents whether the API call is in progress
        error: null // Stores any errors from API calls
    } as BaseState<ICategories> // The state type is BaseState with a string as the data type
};

export const fetchCategoriesData = createAsyncThunk<any, { search?: string, limit?: number }, { state: RootState }>(
    'categories/fetchData',
    async ({ search, limit }, { dispatch, rejectWithValue }) => {
        try {
            // Use a generic start action or create a new one
            dispatch(fetchCategoriesStart());
            const response = await axios.get(`/category/all_categories?limit=${limit || 5}&searchKey=${search?.toString()}`);
            dispatch(fetchCategoriesSuccess(response?.data?.categoriesdata))
            return response?.data;
        } catch (error: any) {
            const errorMsg = error?.message || 'Something Went Wrong';
            dispatch(fetchCategoriesFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);
export const fetchCategoriesTreeData = createAsyncThunk<any, { show_in_menu: boolean }, { state: RootState }>(
    'categories/tree',
    async ({ show_in_menu }, { dispatch, rejectWithValue }) => {
        try {
            // Use a generic start action or create a new one
            dispatch(fetchCategoriesTreeStart());
            const response = await axios.get(`/category/all_categories_tree?show_in_menu=${show_in_menu}`);
            dispatch(fetchCategoriesTreeSuccess(response?.data?.sortedData))
            return response?.data;
        } catch (error: any) {
            const errorMsg = error?.message || 'Something Went Wrong';
            dispatch(fetchCategoriesTreeFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);



const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {

        fetchCategoriesStart(state) {
            state.categoriesState.loading = true;
            state.categoriesState.error = null;
        },
        fetchCategoriesSuccess(state, action) {
            state.categoriesState.loading = false;
            state.categoriesState.data = action.payload;
            state.categoriesState.error = null;
        },
        fetchCategoriesFailure(state, action) {
            state.categoriesState.loading = false;
            state.categoriesState.error = action.payload;
        },
        fetchCategoriesTreeStart(state) {
            state.categoriesTreeState.loading = true;
            state.categoriesTreeState.error = null;
        },
        fetchCategoriesTreeSuccess(state, action) {
            state.categoriesTreeState.loading = false;
            state.categoriesTreeState.data = action.payload;
            state.categoriesTreeState.error = null;
        },
        fetchCategoriesTreeFailure(state, action) {
            state.categoriesTreeState.loading = false;
            state.categoriesTreeState.error = action.payload;
        },
    }
});

export const {
    fetchCategoriesStart,
    fetchCategoriesSuccess,
    fetchCategoriesFailure,
    fetchCategoriesTreeStart,
    fetchCategoriesTreeSuccess,
    fetchCategoriesTreeFailure,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
