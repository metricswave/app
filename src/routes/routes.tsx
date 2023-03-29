import React from "react"
import App from "../layouts/App"
import {RouteObject} from "react-router-dom"
import Notifications from "../pages/Notifications"
import Services from "../pages/Services"
import ErrorPage from "../pages/ErrorPage"
import Authentication from "../pages/Auth"

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
            {
                path: "/auth",
                element: <Authentication/>,
            },
        ],
    },
]
