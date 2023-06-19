export const TWO_SECONDS = 2
export const FIVE_SECONDS = 5
export const THIRTY_SECONDS = 30
export const FIVE_MINUTES_SECONDS = 300
export const TEN_MINUTES_SECONDS = 600
export const FIFTEEN_MINUTES_SECONDS = 900
export const DAY_SECONDS = 86400
const ONE_MONTH_SECONDS = 2629746

const setWithExpiry = function (key: string, value: any, seconds: number = ONE_MONTH_SECONDS) {
    const now = new Date()

    const item = {
        value: value,
        expiry: now.getTime() + (seconds * 1000),
    }

    localStorage.setItem(key, JSON.stringify(item))
}

const getWithExpiry = function <T>(key: string, defaultValue: T, force: boolean = false) {
    const itemStr = localStorage.getItem(key)
    if (!itemStr) {
        return defaultValue
    }

    const item = JSON.parse(itemStr)
    const now = new Date()
    if (now.getTime() > item.expiry && !force) {
        localStorage.removeItem(key)
        return defaultValue
    }

    return item.value
}

export const expirableLocalStorage = {
    get: getWithExpiry,
    set: setWithExpiry,
    delete: (key: string) => {
        localStorage.removeItem(key)
    },
}
