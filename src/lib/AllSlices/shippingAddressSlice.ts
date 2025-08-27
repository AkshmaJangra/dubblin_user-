import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { toast } from 'sonner';
import axios from "../../appUtils/axiosConfig";

export type ICities = {
    id?: string;
    name?: string;
    state_id?: string;
    state_code?: string;
    country_id?: string;
    country_code?: string;
    latitude?: string;
    longitude?: string;
    flag?: string;
    wikiDataId?: string;
};

const initialState = {
    ShippingAddressState: {
        data: [],
        loading: false,
        error: null,
    },
    CitiesListState: {
        data: [],
        loading: false,
        error: null,
    },
    countriesListState: {
        data: [],
        loading: false,
        error: null,
    },
    StateListState: {
        data: [],
        loading: false,
        error: null,
    },
    BillingAddressState: {
        data: [],
        loading: false,
        error: null,
    }
};

export const AddShippingAddress = createAsyncThunk<any, { shippingaddress?: any, userid?: string }, { state: RootState }>(
    'products/fetchData',
    async ({ shippingaddress }, { dispatch, rejectWithValue }) => {
        try {
            dispatch(shippingAddressStart());
            const response = await axios.post(`/shipping_address/new`, shippingaddress);
            dispatch(shippingAddressSuccess(response.data));
            // return Promise.resolve(response.data);
            return response.data;
        } catch (error) {
            dispatch(shippingAddressFailure(error.response.data.message));
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const UpdateShippingAddress = createAsyncThunk<any, { shippingaddress?: any, addressId?: any }, { state: RootState }>(
    'products/fetchData',
    async ({ shippingaddress, addressId }, { dispatch, rejectWithValue }) => {
        try {
            dispatch(shippingAddressStart());
            const response = await axios.put(`/shipping_address/update/${addressId}`, shippingaddress);
            dispatch(shippingAddressSuccess(response.data));
            // return Promise.resolve(response.data);
            return response.data;
        } catch (error) {
            dispatch(shippingAddressFailure(error.response.data.message));
            return rejectWithValue(error.response.data.message);
        }
    }
);
export const BillingAddress = createAsyncThunk<any, { billingaddress?: any }, { state: RootState }>(
    'products/fetchData',
    async ({ billingaddress }, { dispatch, rejectWithValue }) => {

        // Convert object to JSON string before storing
        localStorage.setItem('billingaddress', JSON.stringify(billingaddress));

        dispatch(BillingAddressSuccess(billingaddress));
    }
);


export const DeleteBillingAddress = createAsyncThunk<any, { billingaddress?: any }, { state: RootState }>(
    'products/fetchData',
    async ({ dispatch, rejectWithValue }) => {
        dispatch(DeleteBillingSuccess())
    }
);


export const DeleteShippingAddress = createAsyncThunk<any, { addressId?: any }, { state: RootState }>(
    'products/fetchData',
    async ({ addressId }, { dispatch, rejectWithValue }) => {
        try {
            dispatch(shippingAddressStart());
            const response = await axios.delete(`/shipping_address/delete/${addressId}`);
            dispatch(shippingAddressSuccess(response.data));
            // return Promise.resolve(response.data);
            return response.data;
        } catch (error) {
            dispatch(shippingAddressFailure(error.response.data.message));
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const fetchCitiesList = createAsyncThunk<
    any,
    { input?: string } | void,
    { state: RootState }
>(
    'Cities/fetchCitiesList',
    async (input, { dispatch, rejectWithValue }) => {

        try {
            const { state } = input || {};
            dispatch(fetchCitiesStart());
            const response = await axios.get(`/Cities/all?stateId=${state}`);
            if (response?.data?.success) {
                dispatch(fetchCitiesListSuccess(response?.data));
            } else {
                throw new Error('No status or invalid response');
            }
            return response;
        } catch (error: any) {
            const errorMsg = error?.message ?? 'Something Went Wrong!!';
            dispatch(fetchCitiesFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);

export const fetchCountriesList = createAsyncThunk<
    any,
    { keyword?: string } | void,
    { state: RootState }
>(
    '/countries/all',
    async (input, { dispatch, rejectWithValue }) => {
        try {
            const { keyword } = input || {};
            dispatch(fetchCountriesStart());
            const response = await axios.get(`/countryforuser/all?text=${keyword || ''}`);
            if (response?.data.success) {
                dispatch(fetchCountriesListSuccess(response.data?.allCountryList));
                return response.data;
            } else {
                throw new Error('No status or invalid response');
            }

        } catch (error: any) {
            const errorMsg = error?.message ?? 'Something Went Wrong!!';
            dispatch(fetchCountriesFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);
export const fetchCountryById = createAsyncThunk<
    any,
    { countryId?: string } | void,
    { state: RootState }
>(
    '/country',
    async ({ countryId }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/country/${countryId}`);
            return response?.data

        } catch (error: any) {
            const errorMsg = error?.message ?? 'Something Went Wrong!!';
            return rejectWithValue(errorMsg);
        }
    }
);
export const fetchStateById = createAsyncThunk<
    any,
    { stateId?: string } | void,
    { state: RootState }
>(
    '/state',
    async ({ stateId }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/state/${stateId}`);
            return response?.data

        } catch (error: any) {
            const errorMsg = error?.message ?? 'Something Went Wrong!!';
            return rejectWithValue(errorMsg);
        }
    }
);

export const fetchStateList = createAsyncThunk<
    any,
    { input?: string } | void,
    { state: RootState }
>(
    'State/fetchStateList',
    async (input, { dispatch, rejectWithValue }) => {
        try {
            dispatch(fetchStateStart());
            const response = await axios.get(`/state/all?countryId=101`);
            console.log('response of state api', response?.data);
            if (response?.data?.success) {
                dispatch(fetchStateListSuccess(response?.data?.allStateList));
                return response.data;
            } else {
                throw new Error('No status or invalid response');
            }

        } catch (error: any) {
            const errorMsg = error?.message ?? 'Something Went Wrong!!';
            dispatch(fetchStateFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);

const ShippingAddressSlice = createSlice({
    name: "ShippingAddress",
    initialState,
    reducers: {
        shippingAddressStart(state: any) {
            state.ShippingAddressState.loading = true;
            state.ShippingAddressState.error = null;
        },
        shippingAddressSuccess(state: any, action: any) {
            state.ShippingAddressState.data = action.payload;
            state.ShippingAddressState.loading = false;
        },

        shippingAddressFailure(state: any, action: any) {
            state.ShippingAddressState.error = action.payload;
            state.ShippingAddressState.loading = false;
        },
        BillingAddressSuccess(state: any, action: any) {
            state.BillingAddressState.data = action.payload;
            // state.ShippingAddressState.loading = false;
        },
        DeleteBillingSuccess(state: any) {
            state.BillingAddressState.data.length = 0;
            // state.ShippingAddressState.loading = false;
        },
        fetchCitiesStart(state: any) {
            state.CitiesListState.loading = true;
            state.CitiesListState.error = null;
        },
        fetchCitiesListSuccess(state: any, action: any) {
            state.CitiesListState.loading = false;
            const data = action.payload;
            state.CitiesListState.data = data;
            state.CitiesListState.error = null;
        },
        fetchCitiesFailure(state: any, action: any) {
            state.CitiesListState.loading = false;
            state.CitiesListState.error = action.payload;
        },
        fetchCountriesStart(state: any) {
            state.countriesListState.loading = true;
            state.countriesListState.error = null;
        },
        fetchCountriesListSuccess(state: any, action: any) {
            state.countriesListState.loading = false;
            const data = action.payload;
            state.countriesListState.data = data;
            state.countriesListState.error = null;
        },
        fetchCountriesFailure(state: any, action: any) {
            state.countriesListState.loading = false;
            state.countriesListState.error = action.payload;
        },
        fetchStateStart(state: any) {
            state.StateListState.loading = true;
            state.StateListState.error = null;
        },
        fetchStateListSuccess(state: any, action: any) {
            state.StateListState.loading = false;
            const data = action.payload;
            state.StateListState.data = data;
            state.StateListState.error = null;
        },
        fetchStateFailure(state: any, action: any) {
            state.StateListState.loading = false;
            state.StateListState.error = action.payload;
        },
    },
});

export const {
    shippingAddressStart,
    shippingAddressSuccess,
    shippingAddressFailure,
    BillingAddressSuccess,
    fetchCitiesStart,
    fetchCitiesListSuccess,
    fetchCitiesFailure,
    fetchCountriesStart,
    fetchCountriesListSuccess,
    fetchCountriesFailure,
    fetchStateStart,
    fetchStateListSuccess,
    fetchStateFailure,
    DeleteBillingSuccess
} = ShippingAddressSlice.actions;

export default ShippingAddressSlice.reducer;
