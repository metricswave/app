import {app} from "../config/app"
import ReactPixel from 'react-facebook-pixel';

const eventLastExecuted: { [key: string]: number } = {}
const eventUuidLastExecuted: { [key: string]: number } = {}

export default {
    track: (eventUuid: string, params: Object = {}) => {
        const now = Date.now();
        const lastExecutedTime = eventUuidLastExecuted[eventUuid];

        if (lastExecutedTime !== undefined && now - lastExecutedTime < 3000) {
            return
        }

        if (!app.isProduction) {
            console.log(`[EventTracker] ${eventUuid}`, params)
        } else {
            fetch(`https://metricswave.com/webhooks/${eventUuid}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(params),
            })
        }

        eventUuidLastExecuted[eventUuid] = now
    },

    pixelEvent: (event: string, params: Object = {}) => {
        const now = Date.now();
        const lastExecutedTime = eventLastExecuted[event];

        if (lastExecutedTime !== undefined && now - lastExecutedTime < 3000) {
            return
        }

        if (!app.isProduction) {
            console.log(`[EventTracker] ${event}`, params)
        } else {
            ReactPixel.track(event, params)
        }

        eventLastExecuted[event] = now
    },
}
