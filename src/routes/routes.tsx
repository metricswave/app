import React from "react"
import App from "../layouts/App"
import {RouteObject} from "react-router-dom"
import Services from "../pages/Services"
import ErrorPage from "../pages/ErrorPage"
import SignUp from "../pages/SignUp"
import Login from "../pages/Login"
import Authentication from "../layouts/Authentication"
import ForgotPassword from "../pages/ForgotPassword"
import ResetPassword from "../pages/ResetPassword"
import Triggers from "../pages/Triggers"
import Settings from "../pages/Settings/Settings"
import BillingSettings from "../pages/Settings/BillingSettings"
import ProfileSettings from "../pages/Settings/ProfileSettings"
import ServiceConnection from "../pages/ServiceConnection"
import Trigger from "../pages/Trigger"
import TriggerEdit from "../pages/TriggerEdit"
import {Dashboards} from "../pages/Dashboards"
import Notifications from "../pages/Notifications"
import {Welcome} from "../pages/Welcome"
import {PublicDashboard} from "../pages/PublicDashboard"

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/",
                element: <Dashboards/>,
            },
            {
                path: "/services",
                element: <Services/>,
            },
            {
                path: "/events",
                element: <Triggers/>,
            },
            {
                path: "/events/:triggerUuid",
                element: <Trigger/>,
            },
            {
                path: "/events/:triggerUuid/edit",
                element: <TriggerEdit/>,
            },
            {
                path: "/history",
                element: <Notifications/>,
            },
            {
                path: "/settings",
                element: <Settings/>,
                children: [
                    {
                        path: "/settings/profile",
                        element: <ProfileSettings/>,
                    },
                    {
                        path: "/settings/billing",
                        element: <BillingSettings/>,
                    },
                ],
            },
        ],
    },
    {
        path: "/auth/:driver/callback",
        element: <ServiceConnection/>,
    },
    {
        path: "/welcome",
        element: <Welcome/>,
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
    {
        path: "/:dashboardUuid/:dashboardName",
        element: <PublicDashboard/>,
    },
]
