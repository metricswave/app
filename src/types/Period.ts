export type Period = "daily" | "monthly"
export type ApiPeriod = "day" | "month"

export const apiPeriodFromPeriod = (period: Period): ApiPeriod => {
    switch (period) {
        case "daily":
            return "day"
        case "monthly":
            return "month"
    }
}

export const calculateDate = (period: Period, defaultDate: string | undefined): string => {
    if (defaultDate !== undefined) {
        return defaultDate
    }

    switch (period) {
        case "daily":
            return new Date().toISOString().split("T")[0]
        case "monthly":
            return new Date().toISOString().split("T")[0].slice(0, 7)
    }

    // return period === "daily" ?
    //     new Date().toISOString().split("T")[0] :
    //     new Date().toISOString().split("T")[0].slice(0, 7)
}
