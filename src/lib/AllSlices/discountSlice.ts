import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../appUtils/axiosConfig";
import { toast } from "sonner";
import { RootState } from "../store";

const initialState = {
    user: null,
    error: null,
    loading: false,
    isCodeValid: false,
    promoCode: null,
};

// Verify PromoCode
export const verifyPromoCode = createAsyncThunk<any, { promoCode: string, amount: any }>(
    "promo/verifypromo",
    async ({ promoCode, amount }, { dispatch, rejectWithValue }) => {
        try {
            dispatch(verifyPromoCodeStart());
            const response = await axios.post(`promo/verifypromo`, { promoCode, amount });
            dispatch(verifyPromoCodeSuccess(response.data));
            return response.data; // Return the response data directly
        } catch (error) {
            toast.error(error.response.data.message);
            dispatch(verifyPromoCodeFailure(error.response.data.message));
            return rejectWithValue(error.response.data.message);
        }
    }
);

const promoSlice = createSlice({
    name: "promo",
    initialState,
    reducers: {
        verifyPromoCodeStart(state) {
            state.loading = true;
            state.error = null;
            state.isCodeValid = false;
        },
        verifyPromoCodeSuccess(state, action) {
            state.promoCode = action.payload;
            state.isCodeValid = true;
            state.loading = false;
            state.error = null;
        },
        verifyPromoCodeFailure(state, action) {
            state.error = action.payload;
            state.loading = false;
            state.isCodeValid = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(verifyPromoCode.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isCodeValid = false;
            })
            .addCase(verifyPromoCode.fulfilled, (state, action) => {
                state.promoCode = action.payload;
                state.isCodeValid = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(verifyPromoCode.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
                state.isCodeValid = false;
            });
    },
});

export const {
    verifyPromoCodeStart,
    verifyPromoCodeSuccess,
    verifyPromoCodeFailure,
} = promoSlice.actions;

export default promoSlice.reducer;
