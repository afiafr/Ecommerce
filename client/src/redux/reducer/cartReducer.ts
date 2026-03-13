import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartReducerInitialState } from "../../types/reducer-types";
import type { CartItem, ShippingInfo } from "../../types/types";

const initialState: CartReducerInitialState = {
	loading: false,
	cartItems: [],
	subtotal: 0,
	tax: 0,
	totalMsrp: 0,
	discount: 0,
	total: 0,
	totalItemsInCart: 0,
	shippingInfo: {
		address: "",
		city: "",
		state: "",
		country: "",
		pinCode: "",
	},
};

export const cartReducer = createSlice({
	name: "cartReducer",
	initialState,
	reducers: {
		addToCart: (state, action: PayloadAction<CartItem>) => {
			state.loading = true;
			const index = state.cartItems.findIndex(
				(i) => i.productId === action.payload.productId
			);

			if (index !== -1) state.cartItems[index] = action.payload;
			else state.cartItems.push(action.payload);
            state.totalItemsInCart = state.cartItems.reduce((total, item) => total + item.quantity, 0);
			state.loading = false;
		},

		removeCartItem: (state, action: PayloadAction<string>) => {
			state.loading = true;
			const index = state.cartItems.findIndex(
				(i) => i.productId === action.payload
			);
			if (index !== -1) state.cartItems.splice(index, 1);
            state.totalItemsInCart = state.cartItems.reduce((total, item) => total + item.quantity, 0);
			state.loading = false;
		},

		calculatePrice: (state) => {
			const subtotal = state.cartItems.reduce(
				(total, item) => total + item.msrp * item.quantity,
				0
			);

			state.totalMsrp = Number(subtotal.toFixed(2));
			state.subtotal = Number(state.cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            ).toFixed(2));
            state.discount = Number((state.totalMsrp - state.subtotal).toFixed(2));
			state.total =
				Number(state.subtotal.toFixed(2));
		},

		discountApplied: (state, action: PayloadAction<number>) => {
			state.discount = action.payload;
		},
		saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
			state.shippingInfo = action.payload;
		},

		resetCart: () => initialState,

        getCartItemsFromLocalStorage: (state) => {
            const cartItems = localStorage.getItem("cartItems");
            if (cartItems) {
                state.cartItems = JSON.parse(cartItems);
                state.totalItemsInCart = state.cartItems.reduce((total, item) => total + item.quantity, 0);
            }
        }
	},
});

export const {
	addToCart,
	removeCartItem,
	calculatePrice,
	discountApplied,
	saveShippingInfo,
	resetCart,
    getCartItemsFromLocalStorage,
} = cartReducer.actions;
