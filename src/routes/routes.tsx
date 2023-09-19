import React, {lazy, Suspense} from "react"
import App from "../layouts/App"
import {RouteObject} from "react-router-dom"
import {Dashboards} from "../pages/Dashboards"
import {Welcome} from "../pages/Welcome"
import {PublicDashboard} from "../pages/PublicDashboard"
import LoadingPage from "../pages/LoadingPage"
import Authentication from "../layouts/Authentication"
import SignUp from "../pages/SignUp"
import Login from "../pages/Login"
import ForgotPassword from "../pages/ForgotPassword"
import ResetPassword from "../pages/ResetPassword"
import Services from "../pages/Services"
import ErrorPage from "../pages/ErrorPage"
import Notifications from "../pages/Notifications"
import Settings from "../pages/Settings/Settings"
import ProfileSettings from "../pages/Settings/ProfileSettings"
import BillingSettings from "../pages/Settings/BillingSettings"
import Triggers from "../pages/Triggers"
import Impersonate from "../pages/Impersonate"
import {DashboardsModify} from "../components/dashboard/DashboardsModify"
import {AuthContextProvider} from "../contexts/AuthContext";

const ServiceConnection = lazy(() => import("../pages/ServiceConnection"))
const Trigger = lazy(() => import("../pages/Trigger"))
const TriggerEdit = lazy(() => import("../pages/TriggerEdit"))

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <AuthContextProvider><App/></AuthContextProvider>,
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
                element: <Suspense fallback={<LoadingPage/>}><Trigger/></Suspense>,
            },
            {
                path: "/events/:triggerUuid/edit",
                element: <Suspense fallback={<LoadingPage/>}><TriggerEdit/></Suspense>,
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
        path: "/edit/:dashboardId",
        element: <AuthContextProvider><DashboardsModify/></AuthContextProvider>,
        errorElement: <ErrorPage/>,
    },
    {
        path: "/auth/:driver/callback",
        element: <Suspense fallback={<LoadingPage/>}>
            <AuthContextProvider><ServiceConnection/></AuthContextProvider>
        </Suspense>,
    },
    {
        path: "/welcome",
        element: <AuthContextProvider><Welcome/></AuthContextProvider>,
    },
    {
        path: "/auth",
        element: <AuthContextProvider><Authentication/></AuthContextProvider>,
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
            {
                path: "/auth/impersonate",
                element: <Impersonate/>,
            },
        ],
    },
    {
        path: "/:dashboardUuid/:dashboardName",
        element: <PublicDashboard/>,
    },
]
