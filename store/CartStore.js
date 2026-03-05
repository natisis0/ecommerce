import { configureStore, createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage
function loadCartFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("cart_items");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save cart to localStorage
function saveCartToStorage(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("cart_items", JSON.stringify(items));
  } catch {
    // Silently fail
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    initialized: false,
  },
  reducers: {
    // Initialize cart from localStorage (call once on mount)
    initializeCart: (state) => {
      if (!state.initialized) {
        state.items = loadCartFromStorage();
        state.initialized = true;
      }
    },
    // Replace entire cart (used after fetching from DB or merging)
    setCart: (state, action) => {
      state.items = action.payload;
      state.initialized = true;
    },
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (existingItemIndex > -1) {
        const existingItem = state.items[existingItemIndex];
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.items.splice(existingItemIndex, 1);
        }
      }
      saveCartToStorage(state.items);
    },
    // Fully remove item regardless of quantity
    deleteItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
      saveCartToStorage(state.items);
    },
    // Update quantity to specific value
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
    // Clear localStorage only (after merge to DB)
    clearLocalCart: (state) => {
      state.items = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart_items");
      }
    },
  },
});

const store = configureStore({
  reducer: { cart: cartSlice.reducer },
});

export const storeActions = cartSlice.actions;

export default store;
