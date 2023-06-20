import {app} from "../config/app"

export default {
    track: (eventUuid: string, params: Object = {}) => {
        if (!app.isProduction) {
            console.log(`[EventTracker] ${eventUuid}`, params)
            return
        }

        fetch(`https://notifywave.com/webhooks/${eventUuid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(params),
        })
    },
}
