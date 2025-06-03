import { configureStore } from "@reduxjs/toolkit";
import { cartReducer } from './AllSlices/cartSlice'; // Ensure the path is correct
import settingsReducer from './AllSlices/settingsSlice'; // Ensure the path is correct
import userAuthReducer from './AllSlices/userauthSlice';
import productsReducer from './AllSlices/productsSlice';
import categoriesReducer from './AllSlices/catrgoriesSlice';
import ShippingAddressReducer from './AllSlices/shippingAddressSlice'
import newsletterReducer from './AllSlices/newsletterSlice'
export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      settings: settingsReducer,
      auth: userAuthReducer,
      productsdata: productsReducer,
      categoriesdata: categoriesReducer,
      newsletter:newsletterReducer,
      shippingAddress: ShippingAddressReducer,


    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            'Cities/fetchCitiesList/fulfilled',
            'Cities/fetchCitiesList/rejected',
            '/countries/all/fulfilled',
            '/countries/all/rejected',
            'State/fetchStateList/fulfilled',
            'State/fetchStateList/rejected',
            'products/fetchData/fulfilled',
            'products/fetchData/rejected'
          ]
        }
      })
  })
};


// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
