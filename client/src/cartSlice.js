import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from './axiosInstance';
import { SyncCartApi, GetCartApi } from './Api';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return [];
        const { data } = await axios.get(GetCartApi);
        if (data.Status === 6000) {
            return data.data;
        }
        return [];
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const syncCartToBackend = createAsyncThunk('cart/syncCart', async (items, { rejectWithValue }) => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return;
        await axios.post(SyncCartApi, { items });
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const initialState = {
    items: JSON.parse(localStorage.getItem('cart')) || [],
    status: 'idle',
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            const existing = state.items.find((item) => item.id === product.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ ...product, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        removeFromCart: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter((item) => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find((i) => i.id === productId);
            if (item) {
                item.quantity = quantity;
                if (item.quantity < 1) {
                    state.items = state.items.filter((i) => i.id !== productId);
                }
            }
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem('cart');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                const serverItems = action.payload;
                // Merge logic: Add server items to local items if they don't exist, 
                // or update quantity if they do.
                const merged = [...state.items];
                serverItems.forEach(sItem => {
                    const existing = merged.find(m => m.id === sItem.id);
                    if (existing) {
                        existing.quantity = Math.max(existing.quantity, sItem.quantity);
                    } else {
                        merged.push(sItem);
                    }
                });
                state.items = merged;
                state.status = 'succeeded';
                localStorage.setItem('cart', JSON.stringify(state.items));
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
    state.cart.items.reduce((acc, item) => acc + (parseFloat(item.Rate || 0) * item.quantity), 0);
export const selectCartCount = (state) =>
    state.cart.items.reduce((acc, item) => acc + item.quantity, 0);

export default cartSlice.reducer;
