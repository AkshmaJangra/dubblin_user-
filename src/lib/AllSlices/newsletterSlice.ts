import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../appUtils/axiosConfig";

// Initial State
const initialState = {
  email: "",
  isLoading: false,
  error: null,
  success: false,
};

// Async Thunk for creating an email subscription
export const createEmail = createAsyncThunk(
  "newsletter/create",
  async ({ email, token }: { email: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post("newsletter/create", { email, token });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// Newsletter Slice
const newsletterSlice = createSlice({
  name: "newsletter",
  initialState,
  reducers: {
    clearNewsletterState(state) {
      state.email = "";
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.email = action.payload.email;
      })
      .addCase(createEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

// Export actions
export const { clearNewsletterState } = newsletterSlice.actions;

// Export reducer
export default newsletterSlice.reducer;
