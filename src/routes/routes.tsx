import React from "react"
import App from "../layouts/App"
import {RouteObject} from "react-router-dom"
import Notifications from "../pages/Notifications"
import Services from "../pages/Services"
import ErrorPage from "../pages/ErrorPage"
import SignUp from "../pages/SignUp"
import Login from "../pages/Login"
import Authentication from "../layouts/Authentication"
import ForgotPassword from "../pages/ForgotPassword"
import ResetPassword from "../pages/ResetPassword"

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/",
                element: <Notifications/>,
            },
            {
                path: "/services",
                element: <Services/>,
            },
        ],
    },
    {
        path: "/auth",
        element: <Authentication/>,
        children: [
            {
                path: "/auth/signup",
                element: <SignUp/>,
            },
            {
                path: "/auth/login",
                element: <Login/>,
            },
            {
                path: "/auth/forgot-password",
                element: <ForgotPassword/>,
            },
            {
                path: "/auth/reset-password",
                element: <ResetPassword/>,
            },
        ],
    },
]
