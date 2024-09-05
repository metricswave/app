import {startOfMonth, startOfYear, subMonths, subYears} from "date-fns"
import format from "date-fns/format"

export type Period = "day" | "7d" | "month" | "previous-month" | "30d" | "year" | "previous-year" | "12m"

export const DEFAULT_PERIOD: Period = "30d"

export type PeriodConfiguration = { value: string, label: string, period: Period, date: number }

type PeriodSelectorOptions = { separator: true }
  | PeriodConfiguration
  | { type: 'customSelector', periodSelector: 'daily'}

export const periods: (PeriodConfiguration)[] = [
    {value: "7d", label: "7 days", period: "7d", date: 0},
    {value: "30d", label: "30 days", period: "30d", date: 0},
    {value: "12m", label: "12 months", period: "12m", date: 0},
    {value: "month", label: "Month to date", period: "month", date: 0},
    {
        value: "previous-month",
        label: "Previous month",
        period: "previous-month",
        date: -1,
    },
    {value: "year", label: "Year to date", period: "year", date: 0},
    {
        value: "previous-year",
        label: "Previous year",
        period: "previous-year",
        date: -1,
    },
]

export const periodsWithSeparators: (PeriodSelectorOptions)[] = [
    {value: "7d", label: "7 days", period: "7d", date: 0},
    {value: "30d", label: "30 days", period: "30d", date: 0},
    {value: "12m", label: "12 months", period: "12m", date: 0},
    {separator: true},
    {type: 'customSelector', periodSelector: 'daily'},
    // {value: "month", label: "Month to date", period: "month", date: 0},
    // {
    //     value: "previous-month",
    //     label: "Previous month",
    //     period: "previous-month",
    //     date: -1,
    // },
    // {separator: true},
    // {value: "year", label: "Year to date", period: "year", date: 0},
    // {
    //     value: "previous-year",
    //     label: "Previous year",
    //     period: "previous-year",
    //     date: -1,
    // },
]

export const fieldTypeForPeriod = (periodValue: Period): "date" | "month" => {
    const period = periods.find(p => p.value === periodValue)

    if (period?.period === "month") {
        return "month"
    }

    return "date"
}

export const calculateDefaultDateForPeriodObject = (periodValue: string): Date => {
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

    return date
}

export const calculateDefaultDateForPeriod = (periodValue: string): string => {
    return format(calculateDefaultDateForPeriodObject(periodValue), "yyyy-MM-dd")
}

export const safeApiPeriod = (period: Period): string => {
    if (period === "previous-month") {
        return "month"
    }

    if (period === "previous-year") {
        return "year"
    }

    return period
}
