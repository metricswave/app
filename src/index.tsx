import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import reportWebVitals from "./reportWebVitals"
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import {routes} from "./routes/routes"

const router = createBrowserRouter(routes)

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

const urlRef = (new URLSearchParams(window.location.search)).get("utm_source")
if (urlRef !== null) {
    localStorage.setItem("metricswave:referrer", urlRef)
} else if (
    document.referrer
    && document.referrer !== window.location.hostname
    && localStorage.getItem("metricswave:referrer") === null
) {
    localStorage.setItem("metricswave:referrer", document.referrer)
}

root.render(
    // <React.StrictMode>
    <RouterProvider router={router}/>,
    // </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
