import {app} from "../config/app"
import ReactPixel from 'react-facebook-pixel';

export default {
    track: (eventUuid: string, params: Object = {}) => {
        if (!app.isProduction) {
            console.log(`[EventTracker] ${eventUuid}`, params)
            return
        }

        fetch(`https://metricswave.com/webhooks/${eventUuid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(params),
        })
    },

    pixelEvent: (event: string, params: Object = {}) => {
        if (!app.isProduction) {
            console.log(`[EventTracker] ${event}`, params)
            return
        }

        ReactPixel.track(event, params)
    },
}
