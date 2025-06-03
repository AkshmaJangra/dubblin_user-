import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from "../../appUtils/axiosConfig";

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

export type ICartItems = BaseModel & {
    // Define the properties of a cart item here
};

const initialState = {
    cartItemsState: {
        data: [] as ICartItems[], // Initial data as an empty array
        loading: false, // Represents whether the API call is in progress
        error: null // Stores any errors from API calls
    } as BaseState<ICartItems[]> // The state type is BaseState with an array of ICartItems as the data type
};

export const fetchCartItemsData = createAsyncThunk<any, { items: any[] }, { state: RootState }>(
    'cartItems/fetchCartItemsData',
    async ({ items }, { dispatch, rejectWithValue }) => {
        try {
            dispatch(fetchCartItemsStart());
            const response = await axios.post(`/allcartItems`, items);
            dispatch(fetchCartItemsSuccess(response.data));
            return response.data;
        } catch (error: any) {
            const errorMsg = error?.message || 'Something Went Wrong';
            dispatch(fetchCartItemsFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);

const cartItemsSlice = createSlice({
    name: 'cartItems',
    initialState,
    reducers: {
        fetchCartItemsStart(state) {
            state.cartItemsState.loading = true;
            state.cartItemsState.error = null;
        },
        fetchCartItemsSuccess(state, action) {
            state.cartItemsState.loading = false;
            state.cartItemsState.data = action.payload;
            state.cartItemsState.error = null;
        },
        fetchCartItemsFailure(state, action) {
            state.cartItemsState.loading = false;
            state.cartItemsState.error = action.payload;
        }
    }
});

export const {
    fetchCartItemsStart,
    fetchCartItemsSuccess,
    fetchCartItemsFailure
} = cartItemsSlice.actions;

export default cartItemsSlice.reducer;
