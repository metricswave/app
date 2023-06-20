import {startOfMonth, startOfYear, subMonths, subYears} from "date-fns"
import format from "date-fns/format"

export type Period = "day" | "7d" | "month" | "30d" | "year" | "12m"

export const DEFAULT_PERIOD: Period = "30d"

type PeriodConfiguration = { value: string, label: string, period: Period, date: string | null }

export const periods: (PeriodConfiguration)[] = [
    {value: "7d", label: "7 days", period: "7d", date: null},
    {value: "30d", label: "30 days", period: "30d", date: null},
    {value: "12m", label: "12 months", period: "12m", date: null},
    {value: "month", label: "Month to date", period: "month", date: null},
    {
        value: "previous-month",
        label: "Previous month",
        period: "month",
        date: null,
    },
    {value: "year", label: "Year to date", period: "year", date: null},
    {
        value: "previous-year",
        label: "Previous year",
        period: "year",
        date: null,
    },
]

export const fieldTypeForPeriod = (periodValue: Period): "date" | "month" => {
    const period = periods.find(p => p.value === periodValue)

    if (period?.period === "month") {
        return "month"
    }

    return "date"
}

export const calculateDefaultDateForPeriod = (periodValue: string): string => {
    const period = periods.find(p => p.value === periodValue)
    let date = new Date()

    if (period !== undefined && period.value === "month") {
        date = startOfMonth(new Date())
    } else if (period !== undefined && period.value === "previous-month") {
        date = startOfMonth(subMonths(new Date(), 1))
    } else if (period !== undefined && period.value === "year") {
        date = startOfYear(new Date())
    } else if (period !== undefined && period.value === "previous-year") {
        date = startOfYear(subYears(new Date(), 1))
    }

    return format(date, "yyyy-MM-dd")
}
