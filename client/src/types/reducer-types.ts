import type { CartItem, ShippingInfo, User } from "./types";

export interface UserReducerInitialState{
    user: User| null;
    loading:boolean;
    token:string| null
}
export interface CartReducerInitialState {
    loading: boolean;
    cartItems: CartItem[];
    subtotal: number;
    tax: number;
    totalMsrp: number;
    discount: number;
    total: number;
    shippingInfo: ShippingInfo;
    totalItemsInCart: number;
  }

export interface CartState {
  cartItems: CartItem[];
}
