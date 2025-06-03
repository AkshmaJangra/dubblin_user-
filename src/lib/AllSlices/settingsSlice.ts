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


export type ISettings = BaseModel & {
  logo: string;
  favicon: string;
  meta_title: string;
  meta_tag: string;
  meta_description: string;
  copyright: string;
};

const initialState = {
  settingsState: {
    data: {}, // Initial description as an empty string
    loading: false, // Represents whether the API call is in progress
    error: null // Stores any errors from API calls
  } as BaseState<ISettings> // The state type is BaseState with a string as the data type
};

export const fetchSettings = createAsyncThunk<any, void, { state: RootState }>(
  'settings/fetchData',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Use a generic start action or create a new one
      const response = await axios.get('/settings/get');
      dispatch(fetchSingleSettingsStart());
      return response.data;
      // if (response?.success) {
      //   dispatch(fetchSingleSettingsSuccess(response)); // Assuming response contains `descriptionData`
      //   return response;
      // } else {
      //   const errorMsg = response?.message || 'Failed to fetch description';
      //   dispatch(fetchSingleSettingsFailure(errorMsg));
      //   return rejectWithValue(errorMsg);
      // }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleSettingsFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);



const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    fetchTermsConditionsStart(state) {
      state.settingsState.loading = true;
      state.settingsState.error = null;
    },

    addEditSettingsStart(state) {
      state.settingsState.loading = true;
      state.settingsState.error = null;
    },
    addEditSettingsSuccess(state) {
      state.settingsState.loading = false;
      state.settingsState.error = null;
    },
    addEditSettingsFailure(state, action) {
      state.settingsState.loading = false;
      state.settingsState.error = action.payload;
    },
    fetchSingleSettingsStart(state) {
      state.settingsState.loading = true;
      state.settingsState.error = null;
    },
    fetchSingleSettingsSuccess(state, action) {
      state.settingsState.loading = false;
      state.settingsState.data = action.payload;
      state.settingsState.error = null;
    },
    fetchSingleSettingsFailure(state, action) {
      state.settingsState.loading = false;
      state.settingsState.error = action.payload;
    }
  }
});

export const {
  addEditSettingsStart,
  addEditSettingsSuccess,
  addEditSettingsFailure,

  fetchSingleSettingsStart,
  fetchSingleSettingsSuccess,
  fetchSingleSettingsFailure
} = settingsSlice.actions;

export default settingsSlice.reducer;
