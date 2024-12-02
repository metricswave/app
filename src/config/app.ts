export const isProduction = process.env.NODE_ENV === "production";

const productionPath = "https://metricswave.com";
const developmentPath = "http://metricswave.test";

export const app = {
    name: "MetricsWave",
    env: process.env.NODE_ENV,
    isProduction,
    web: isProduction ? `${productionPath}` : `${developmentPath}`,
    api: isProduction ? `${productionPath}/api` : `${developmentPath}/api`,
    webhooks: isProduction ? `${productionPath}/webhooks` : `${developmentPath}/webhooks`,
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
};
