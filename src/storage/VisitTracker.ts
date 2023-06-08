import {useLocation} from "react-router-dom"
import {useEffect} from "react"
import {app} from "../config/app"

export const TrackVisit = function () {
    const location = useLocation()

    useEffect(() => {
        let path = "https://notifywave.com/webhooks/f41ff0fd-4475-499c-b086-82d6012bbf16"

        if (!app.isProduction) {
            console.log("VisitTracker", location.pathname)
            path = "http://notifywave.test/webhooks/5ce1a21a-7972-40ec-812a-408e7e7dd642"
        }

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
