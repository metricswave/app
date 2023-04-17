export const app = {
    name: "NotifyWave",
    web: process.env.NODE_ENV === "production" ?
        "https://notifywave.com" :
        "http://notifywave.test",
    api: process.env.NODE_ENV === "production" ?
        "https://notifywave.com/api" :
        "http://notifywave.test/api",
    webhooks: process.env.NODE_ENV === "production" ?
        "https://notifywave.com/webhooks" :
        "http://notifywave.test/webhooks",
}
