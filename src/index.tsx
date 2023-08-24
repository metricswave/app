import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import reportWebVitals from "./reportWebVitals"
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import {routes} from "./routes/routes"
import * as Sentry from "@sentry/react"
import {app} from "./config/app"

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

Sentry.init({
    dsn: "https://44dd33b9ab074fd8bbae88f64b7bce87@o4505407458902016.ingest.sentry.io/4505407464079360",
    integrations: [
        new Sentry.BrowserTracing({
            tracePropagationTargets: [/^https:\/\/metricswave\.com/],
        }),
        new Sentry.Replay(),
    ],
    environment: app.env,
    tracesSampleRate: 0.2, // Capture 100% of the transactions, reduce in production!
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%.
    replaysOnErrorSampleRate: 1.0, // Change the sample rate to 100% when sampling sessions where errors occur.
})

root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
