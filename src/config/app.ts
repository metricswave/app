const isProduction = process.env.NODE_ENV === "production"

const productionPath = "https://notifywave.com"
const developmentPath = "http://notifywave.test"

export const app = {
    name: "NotifyWave",
    env: process.env.NODE_ENV,
    isProduction,
    web: isProduction ? `${productionPath}` : `${developmentPath}`,
    api: isProduction ? `${productionPath}/api` : `${developmentPath}/api`,
    webhooks: isProduction ? `${productionPath}/webhooks` : `${developmentPath}/webhooks`,
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
}
