﻿import {createBrowserRouter, Navigate} from "react-router-dom";
import App from "../layout/App";
import ContactPage from "../../features/contact/ContactPage";
import AboutPage from "../../features/about/AboutPage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import Register from "../../features/account/Register";
import Login from "../../features/account/Login";
import RequireAuth from "./RequireAuth";
import Orders from "../../features/orders/Orders";
import OrderDetails from "../../features/orders/OrderDetails";
import CheckoutWrapper from "../../features/checkout/CheckoutWrapper";
import Inventory from "../../features/admin/Inventory";

export const router = createBrowserRouter([{
    path: '/',
    element: <App/>,
    children: [
        {
            element: <RequireAuth/>, children: [
                {path: '/checkout', element: <CheckoutWrapper/>},
                {path: '/orders', element: <Orders/>},
                {path: '/orders/:id', element: <OrderDetails/>},
            ]
        },
        {
            element: <RequireAuth roles={['Admin']}/>, children: [
                {path: '/inventory', element: <Inventory/>},
            ]
        },
        {path: '/about', element: <AboutPage/>},
        {path: '/contact', element: <ContactPage/>},
        {path: '/catalog', element: <Catalog/>},
        {path: '/catalog/:id', element: <ProductDetails/>},
        {path: '/server-error', element: <ServerError/>},
        {path: '/not-found', element: <NotFound/>},
        {path: '/basket', element: <BasketPage/>},
        {path: '/checkout', element: <CheckoutPage/>},
        {path: '/login', element: <Login/>},
        {path: '/register', element: <Register/>},
        {path: '*', element: <Navigate replace to='/not-found'/>},
    ]
}]);