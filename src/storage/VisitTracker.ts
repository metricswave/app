import {useLocation} from "react-router-dom"
import {useEffect} from "react"
import {app} from "../config/app"

export const TrackVisit = function () {
    const location = useLocation()

    useEffect(() => {
        if (!app.isProduction) {
            console.log("VisitTracker", location.pathname)
            return
        }

        const path = "https://notifywave.com/webhooks/f41ff0fd-4475-499c-b086-82d6012bbf16"

        fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                path: location.pathname,
            }),
        })
    }, [location])
}
