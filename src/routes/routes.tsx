import React, {lazy} from "react"
import App from "../layouts/App"
import {RouteObject} from "react-router-dom"
import {Dashboards} from "../pages/Dashboards"
import {Welcome} from "../pages/Welcome"
import {PublicDashboard} from "../pages/PublicDashboard"

const Services = lazy(() => import("../pages/Services"))
const ErrorPage = lazy(() => import("../pages/ErrorPage"))
const Triggers = lazy(() => import("../pages/Triggers"))
const Settings = lazy(() => import("../pages/Settings/Settings"))
const BillingSettings = lazy(() => import("../pages/Settings/BillingSettings"))
const ProfileSettings = lazy(() => import("../pages/Settings/ProfileSettings"))
const ServiceConnection = lazy(() => import("../pages/ServiceConnection"))
const Trigger = lazy(() => import("../pages/Trigger"))
const TriggerEdit = lazy(() => import("../pages/TriggerEdit"))
const Notifications = lazy(() => import("../pages/Notifications"))
const Authentication = lazy(() => import("../layouts/Authentication"))
const SignUp = lazy(() => import("../pages/SignUp"))
const Login = lazy(() => import("../pages/Login"))
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"))
const ResetPassword = lazy(() => import("../pages/ResetPassword"))

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
