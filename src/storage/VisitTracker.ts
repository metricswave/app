import {useLocation} from "react-router-dom"
import { useUserState } from "./User"
import { useAuthState } from "./AuthToken"
import { app } from "../config/app"
import { useEffect, useState } from "react"

export const TrackVisit = function () {
    const {isAuth} = useAuthState()
    const {user} = useUserState(isAuth)
    const location = useLocation()
    const [previousLocation, setPreviousLocation] = useState<string>("")
    const fullLocation = location.pathname + location.search

    useEffect(() => {
        const params = {
            user: user?.email ?? "Anonymous",
        }

        if (previousLocation === fullLocation) {
            return
        }

        setPreviousLocation(fullLocation)

        if (!app.isProduction) {
            console.log("VisitTracker", params)
            return
        }

        const path = "https://metricswave.com/webhooks/5410d97c-3255-4a2a-a967-4326bb3458a6"

        fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(params),
        })
    }, [location])
}
