import React from "react"
import {Outlet} from "react-router-dom"
import {TrackVisit} from "../storage/VisitTracker"

export default function Authentication() {
    TrackVisit()

    return (
        <Outlet/>
    )
}
