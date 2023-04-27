import * as amplitude from "@amplitude/analytics-browser"
import {app} from "../config/app"

export default {
    track: (event: string) => {
        if (!app.isProduction) {
            console.log(`[EventTracker] ${event}`)
            return
        }

        amplitude.track(event)
    },
}
