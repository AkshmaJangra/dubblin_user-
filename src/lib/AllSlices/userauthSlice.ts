import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../appUtils/axiosConfig";
import { toast } from "sonner";


const initialState = {
    user: null,
    isLoggedIn: false,
    isLoading: false,
    isLoginLoading: false,
    error: null,
    isAuthenticated: false,
    otpSent: false,
    currentPage: 0,
    totalPages: 0,
    isProfileUpdated: false,
    isPasswordUpdated: false,
    updatedProfileData: [],
    message: null,
    inputvalues: null,
    isUpdated: null,

};

function saveUserData(responseData) {
    localStorage.setItem("userId", responseData?.user?._id);
    localStorage.setItem("userImage", responseData?.user?.image);
    localStorage.setItem("token", responseData?.token);
}

export const registerUser = createAsyncThunk(
    "user/register",
    async ({ name, last_name, email, phone, password, token }: { name: string, last_name: string, email: string, phone: any, password: string, token: string }, { dispatch, rejectWithValue }) => {
        try {
            const userData = new FormData()
            userData.append('name', name)
            userData.append('last_name', last_name)
            userData.append('email', email)
            userData.append('phone', phone)
            userData.append('password', password)
            userData.append('token', token)

            userData.forEach((value, key) => console.log(`${key}: ${value}`));
            dispatch(registerStart());
            const response = await axios.post(`users/register`, userData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            dispatch(registerSuccess(response.data)); // Dispatch the success action with the response data
            return response.data;
        } catch (error) {
            dispatch(registerFailure(error.response.data.message));
            return error.response?.data
            // return rejectWithValue(error.response.data.message); // Return the error if needed
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { dispatch, rejectWithValue }) => {
        try {
            dispatch(loginStart());
            const response = await axios.post(`users/login`, userData);
            saveUserData(response.data);
            dispatch(loginSuccess(response.data?.user));
            if (response?.data?.success == true) {
                toast.message("Login Successfully");
            }
            // return response.data
        } catch (error) {
            dispatch(loginFailure(error.response.data.message));
            toast.message(error.response.data.message);
            return rejectWithValue(error.response.data.message);
        }
    }
);

// export const checkSocialLogin = createAsyncThunk(
//     "auth/checkSocialLogin",
//     async (_, { dispatch, rejectWithValue }) => {
//         try {
//             dispatch(checkSocialLoginstart());
//             const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
//             const response = await axios.get(url, {
//                 withCredentials: true,
//                 headers: { "Cache-Control": "no-cache" },
//             });
//             if (response.data?.success) {
//                 saveUserData(response.data);
//                 dispatch(checkSocialLoginsuccess(response.data?.user));
//             }
//         } catch (error) {
//             dispatch(checkSocialLoginFailure(error.response.data.message));
//             return rejectWithValue(error.response.data.message);
//         }
//     }
// );

// export const loadUser = createAsyncThunk(
//     "auth/loadUser",
//     async (_, { dispatch, rejectWithValue }) => {
//         try {
//             dispatch(loaduserStart());
//             const response = await axios.get(`user/me`, {
//                 headers: { "Cache-Control": "no-cache" },
//             });
//             dispatch(loadUserSuccess(response?.data));
//             return response?.data.success;
//         } catch (error) {
//             dispatch(loadUserfailure(error.response.data.message));
//             return false;
//             //return rejectWithValue(error.response.data.message)
//         }
//     }
// );


// const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// export const logout = createAsyncThunk(
//     "auth/logout",
//     async (_, { dispatch, rejectWithValue }) => {
//         try {
//             // dispatch(logoutuserStart())
//             const response = await axios.post(`user/logout`, {
//                 withCredentials: true,
//             });
//             const url = `${process.env.REACT_APP_API_URL}/auth/sociallogout`;
//             const response2 = await axios.get(url, {
//                 withCredentials: true,
//                 headers: { "Cache-Control": "no-cache" },
//             });
//             //removeUserData
//             document.cookie =
//                 "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//             document.cookie =
//                 "session.sig=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//             localStorage.removeItem("userId");
//             localStorage.removeItem("userImage");
//             localStorage.removeItem("token");

//             dispatch(logoutuserSuccess(response?.data?.message));
//             return response?.data?.message;
//         } catch (error) {
//             dispatch(logoutuserFailure(error.response.data.message));
//             //return rejectWithValue(error.response.data.message);
//             return false;
//         }
//     }
// );





//   forgot password
export const forgotPassword = createAsyncThunk(
    "auth/forgotpassword",
    async ({ email, mobile, token }: { email: string; mobile: string, token: any }, { dispatch, rejectWithValue }) => {
        try {
            dispatch(forgotStart());
            const response = await axios.post(`users/forgotpassword`, {
                email,
                mobile,
                token,
            });
            dispatch(forgotSuccess(response?.data));
            return response.data;
        } catch (error) {
            dispatch(forgotFailure(error.response.data));
            // dispatch(forgotFailure(error.response.message));
            return rejectWithValue(error.response.message);
        }
    }
);

// verifyOTP

export const verifyOTP = createAsyncThunk(
    "auth/verifyotp",
    async (
        { phone, otp }: { phone: any, otp: string },
        { dispatch, rejectWithValue }
    ) => {
        try {
            dispatch(verifyOTPStart());



            const response = await axios.post(`users/register/otp`, {
                phone,
                otp,
            });


            dispatch(verifyOTPSuccess(response.data));
            return response?.data;
        } catch (error) {
            dispatch(verifyOTPFailure(error.response.data));
            return rejectWithValue(error.response.data);
        }
    }
);

export const verifyRegisteredUserOTP = createAsyncThunk(
    "auth/verifyotp",
    async ({ mobile, email, otp }: { mobile: string; email: string; otp: string }, { dispatch, rejectWithValue }) => {
        try {
            dispatch(verifyRegisteredUserStart());
            const response = await axios.post(`users/forgotpassword/otp`, {
                mobile, otp, email
            });


            return response?.data;
        } catch (error) {
            dispatch(verifyRegisteredUserFailure(error.response.data));

            return rejectWithValue(error.response.data);
        }
    }
);

// reset password
export const resetPassword = createAsyncThunk(
    "auth/resetpassword",
    async (
        { id, oldPassword, newPassword },
        { dispatch, rejectWithValue }
    ) => {
        try {
            dispatch(resetStart());
            const response = await axios.put(`users/resetpassword/${id}`, {
                oldPassword,
                newPassword,
            });

            dispatch(resetSuccess(response.success));

            return response.data;
        } catch (error) {
            dispatch(resetFailure(error.response.data));
            return rejectWithValue(error.response.message);
        }
    }
);

export const changePassword = createAsyncThunk(
    "auth/resetpassword",
    async (
        { newPassword, email, phone, token }: { newPassword: string; email: string; phone: string; token: any },
        { dispatch, rejectWithValue }
    ) => {
        try {
            dispatch(updatepasswordStart());
            const { data } = await axios.put(`users/forgotpassword/update`, {
                email,
                newPassword,
                phone,
                token: token,

            });

            dispatch(updatepasswordSuccess(data.success));
            return data;
        } catch (error) {
            // Pass the error message from the backend response
            const errorMessage =
                error.response?.data?.message || "Password update failed";
            dispatch(updatepasswordFailure(errorMessage));
            return rejectWithValue({ message: errorMessage });
        }
    }
);


export const updateUserProfile = createAsyncThunk(
    "auth/updateUserProfile",
    async ({ formData, userId }: { formData: any, userId: string }, { dispatch, rejectWithValue }) => {
        try {
            dispatch(updateUserProfileStart());
            // Make PUT request to update user PROFILE
            const response = await axios.put(`/users/updateprofile/${userId}`, formData);

            // Dispatch the success action with the updated Profile data
            dispatch(updateUserProfileSuccess(response.data));
            return response?.data;
        } catch (error) {
            // Dispatch the failure action with the error message
            dispatch(updateUserProfileFailure(error.response.data.message));
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const resendOtp = createAsyncThunk(
    "user/resend_otp",
    async (email, { dispatch, rejectWithValue }) => {
        try {
            dispatch(resendStart());
            const formData = new FormData();
            if (email) {
                formData.append("email", email);
            } else {
                throw new Error("Email is required and cannot be null or undefined.");
            }
            const response = await axios.post(`users/resend_otp`, formData);
            if (response.data?.success) {
                toast.success("OTP sent successfully to your email address.");
            }
            dispatch(resendSuccess(response.data)); // Dispatch the success action with the response data
            return response.data;
        } catch (error) {
            dispatch(resendFailure(error.response.data.message));
            return rejectWithValue(error.response.data.message); // Return the error if needed
        }
    }
);


const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        registerStart(state) {
            state.isLoading = true;
            state.error = null;
            state.isAuthenticated = false;
        },
        registerSuccess(state, action) {
            // state.user = action.payload;
            state.isLoggedIn = true;
            state.isLoading = false;
            if (action.payload.success) {
                state.otpSent = true;
            }
        },
        registerFailure(state, action) {
            state.error = action.payload;
            state.isLoading = false;
            state.isAuthenticated = false;
        },
        loginStart(state) {
            state.isLoginLoading = true;
            state.error = null;
            state.isAuthenticated = false;
        },
        loginSuccess(state, action) {
            state.user = action.payload;
            state.isLoggedIn = true;
            state.isLoginLoading = false;
            state.isAuthenticated = true;
        },
        loginFailure(state, action) {
            state.error = action.payload;
            state.isLoginLoading = false;
            state.isAuthenticated = false;
        },
        loaduserStart(state) {
            state.isLoading = true;
            state.error = null;
            // state.isAuthenticated = false;
        },
        loadUserSuccess(state, action) {
            state.user = action.payload.user;
            state.isLoggedIn = true;
            state.isLoading = false;
            state.isAuthenticated = true;
        },
        loadUserfailure(state, action) {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;
        },
        logoutuserSuccess(state, action) {
            state.isLoading = false;
            state.isLoggedIn = false;
            state.isAuthenticated = false;
            state.user = null;
        },
        checkSocialLoginstart(state, action) {
            state.isLoading = true;
            state.error = null;
            state.isAuthenticated = false;
        },
        checkSocialLoginsuccess(state, action) {
            state.user = action.payload;
            state.isLoggedIn = true;
            state.isLoading = false;
            state.isAuthenticated = true;
        },
        checkSocialLoginFailure(state, action) {
            state.error = action.payload;
            state.isLoading = false;
            state.isAuthenticated = false;
        },


        //forgotpassword
        forgotStart(state, action) {
            state.isLoading = true;
        },
        forgotSuccess(state, action) {
            state.isLoading = false;
            // state.message =action.payload.message;
            state.message = action.payload;
        },
        forgotFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        verifyOTPStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        verifyOTPSuccess(state, action) {
            state.isLoading = false;
            state.message = action.payload.message;
            state.error = null;
        },
        verifyOTPFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload.message || action.payload;
        },
        verifyRegisteredUserStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        verifyRegisteredUserSuccess(state, action) {
            state.isLoading = false;
            state.message = action.payload.message;
            state.error = null;
            state.user = action.payload?.user;
            state.isAuthenticated = true;
        },
        verifyRegisteredUserFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload.message || action.payload;
        },
        resetStart(state, action) {
            state.isLoading = true;
        },
        resetSuccess(state, action) {
            state.isLoading = false;
            state.data = action.payload;
        },
        resetFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        updatepasswordStart(state, action) {
            state.isPasswordUpdated = true;
        },
        updatepasswordSuccess(state, action) {
            state.isPasswordUpdated = false;
            state.isUpdated = action.payload;
        },
        updatepasswordFailure(state, action) {
            state.isPasswordUpdated = false;
            state.error = action.payload;
            state.message = action.payload;
        },

        updateInputChanges(state, action) {
            state.inputvalues = action.payload;
        },

        updateUserProfileStart(state) {
            state.isLoading = true;
            state.isProfileUpdated = false;
            state.error = null;
        },
        updateUserProfileSuccess(state, action) {
            state.isLoading = false;
            state.isProfileUpdated = true;
            state.updatedProfileData = action.payload;
            state.error = null;
        },
        updateUserProfileFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        resendStart(state) {
            state.isLoading = true;
            state.error = null;
            state.isAuthenticated = false;
        },
        resendSuccess(state, action) {
            // state.user = action.payload;
            state.isLoggedIn = true;
            state.isLoading = false;
            if (action.payload.success) {
                state.otpSent = true;
            }
        },
        resendFailure(state, action) {
            state.error = action.payload;
            state.isLoading = false;
            state.isAuthenticated = false;
        },
    },
});

export const {
    verifyRegisteredUserStart,
    verifyRegisteredUserSuccess,
    verifyRegisteredUserFailure,
    registerStart,
    registerSuccess,
    registerFailure,
    loginStart,
    loginSuccess,
    loginFailure,
    loaduserStart,
    loadUserSuccess,
    loadUserfailure,
    logoutuserSuccess,
    // logoutuserFailure,
    checkSocialLoginstart,
    checkSocialLoginsuccess,
    checkSocialLoginFailure,
    forgotStart,
    forgotSuccess,
    forgotFailure,
    verifyOTPStart,
    verifyOTPSuccess,
    verifyOTPFailure,
    resetStart,
    resetSuccess,
    resetFailure,

    updatepasswordStart,
    updatepasswordSuccess,
    updatepasswordFailure,
    updateUserProfileStart,
    updateUserProfileSuccess,
    updateUserProfileFailure,
    resendStart,
    resendSuccess,
    resendFailure,
    updateInputChanges,

} = authSlice.actions;

export default authSlice.reducer;
