import {Basket} from "./basketItem";

export interface User {
    email: string;
    token: string;
    basket?: Basket;
}