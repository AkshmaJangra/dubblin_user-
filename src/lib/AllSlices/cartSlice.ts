import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of an item in the cart
export interface CartItem {
  quantity?: number;
  _id?: any;
  matchingVariation?: any;
  buyNow?: boolean;
}

interface discount {
  code: any;
  value: number;
  _id?: string;
  desp: string;
}

interface gst {
  igst: number;
  cgst: number;
  sgst: number;
}

// Define the state shape
interface CartState {
  items: CartItem[];
}

// Load cart state from local storage
const loadState = (): CartState => {
  try {
    const serializedState = localStorage.getItem("cart");
    if (serializedState === null) {
      return { items: [] };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { items: [] };
  }
};

// Save cart state to local storage
const saveState = (state: CartState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("cart", serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

// Initial state with the type of CartState
const initialState: CartState = loadState();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItems: (state, action: PayloadAction<CartItem>) => {
      if ((action?.payload?.quantity ?? 0) < 1) {
        return;
      }
      let itid: any;
      const storedata = {
        _id: action?.payload?.matchingVariation?._id,
        quantity: action.payload.quantity,
      };
      const existingItem = state?.items?.find((item) => {
        return item?._id === action?.payload?.matchingVariation?._id;
      });
      if (existingItem) {
        itid = existingItem?._id;
        if (existingItem.quantity !== undefined) {
          existingItem.quantity += action?.payload?.quantity ?? 0; // Increase quantity
        }
      } else {
        itid = action?.payload?.matchingVariation?._id;
        state?.items?.push(storedata);
      }

      saveState(state);

      if (action.payload?.buyNow) {
        window.location.href = `/checkout?buynow=${action?.payload?.buyNow}&id=${itid}`;
      }
    },

    removeItems: (state, action: PayloadAction<{ _id: string }>) => {

      state.items = state?.items.filter(
        (item) => item?._id !== action?.payload?._id
      );

      saveState(state);
    },

    increaseQuantity: (state, action: PayloadAction<{ _id: string }>) => {
      const item = state.items.find((item) => item?._id === action?.payload?._id);

      if (item) {
        if (item.quantity !== undefined) {
          item.quantity += 1;
        }
        saveState(state);
      }
    },

    decreaseQuantity: (state, action: PayloadAction<{ _id: string }>) => {
      const item = state?.items.find((item) => item?._id === action?.payload?._id);

      if (item && item.quantity !== undefined && item.quantity > 1) {
        item.quantity -= 1;
        saveState(state);
      }
    },
    clearCart: (state) => {
      state.items = [];
      saveState(state);
    },
  },
});

export const { addItems, removeItems, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

