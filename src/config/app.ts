const isProduction = process.env.NODE_ENV === "production"

export const app = {
    name: "NotifyWave",
    env: process.env.NODE_ENV,
    isProduction,
    web: isProduction ?
        "https://notifywave.com" :
        "http://notifywave.test",
    api: isProduction ?
        "https://notifywave.com/api" :
        "http://notifywave.test/api",
    webhooks: isProduction ?
        "https://notifywave.com/webhooks" :
        "http://notifywave.test/webhooks",
}
