import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../appUtils/axiosConfig";

interface OrderState {
    order: any;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: OrderState = {
    order: null,
    status: 'idle',
    error: null,
};

interface OrderPayload {
    amount: number;
    products: {
        productId: string;
        variantId: string;
        specialPrice: number;
        quantity: number;
        paidAmount: number;
    }[];
    userId: string;
    billingAddress?: any;
    shippingAddress?: any;
    discount?: number;
}

export const createOrder = createAsyncThunk(
    'order/new',
    async (orderPayload: OrderPayload, { rejectWithValue }) => {
        try {
            const response = await axios.post('/order/new', orderPayload);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Error creating order");
        }
    }
);

export const updateOrder = createAsyncThunk(
    "vendorbydomain/order",
    async ({ orderId, status, transactionId }: { orderId: string; status: string; transactionId: string }, { dispatch, rejectWithValue }) => {
        try {
            if (!orderId) return rejectWithValue("No order!");
            const response = await axios.put(
                `/order/updateorder/${orderId}`,
                { transactionId, status, orderId }
            );

            if (response?.status) {
                dispatch(updateOrderSuccess(response.data));
            } else {
                const errorMsg = response?.data?.message ?? "Something went wrong!!";
                dispatch(updateOrderFailure(errorMsg));
                return rejectWithValue(errorMsg);
            }
        } catch (error: any) {
            const errorMsg = error?.message ?? "Something went wrong!!";
            dispatch(updateOrderFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);
export const verifyPayment = createAsyncThunk(
    "verify-payment",
    async (payloadData, { dispatch, rejectWithValue }) => {
        try {
            if (!payloadData) {
                return rejectWithValue("Please Response and orderId Data!");
            }
            const response = await axios.post(`/order/verify-payment`,
                payloadData
            );
            if (response?.status) {
                return response;
            } else {
                const errorMsg = response?.data?.message ?? "Something went wrong!!";
                return rejectWithValue(errorMsg);
            }
        } catch (error) {
            const errorMsg = error?.message ?? "Something went wrong!!";
            return rejectWithValue(errorMsg);
        }
    }
);
const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        updateOrderStart(state) {
            state.status = 'loading';
            state.error = null;
        },
        updateOrderSuccess(state, action) {
            state.status = 'succeeded';
            state.order = action.payload;
            state.error = null;
        },
        updateOrderFailure(state, action) {
            state.status = 'failed';
            state.error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.order = action.payload;
                state.error = null;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const {
    updateOrderStart,
    updateOrderSuccess,
    updateOrderFailure
} = orderSlice.actions;

export default orderSlice.reducer;
