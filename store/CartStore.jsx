import { configureStore, createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += 1; // Mutate directly (Immer handles immutability)
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingItemIndex > -1) {
        const existingItem = state.items[existingItemIndex];
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1; // Decrement quantity
        } else {
          state.items.splice(existingItemIndex, 1); // Remove item if quantity is 1
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

const store = configureStore({
  reducer: { cart: cartSlice.reducer},
});

export const storeActions = cartSlice.actions;

export default store;