import {useEffect, useState} from "react"
import {expirableLocalStorage} from "../helpers/ExpirableLocalStorage"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import eventTracker from "../helpers/EventTracker"

const KEY = "nw:available-plans"

type AvailablePrices = Plan[]

export type Plan = {
    id: number
    name: "Free" | "Basic" | "Starter" | "Business" | "Enterprise"
    monthlyPrice: number
    yearlyPrice: number
    dataRetentionInMonths: number | null
    dedicatedSupport: boolean
    eventsLimit: number | null
}

export function planPrice(plan: Plan, type: "monthly" | "yearly"): number {
    if (type === "monthly") {
        return plan.monthlyPrice
    } else {
        return plan.yearlyPrice
    }
}

export function useAvailablePricesState() {
    const cachedPrices = expirableLocalStorage.get<AvailablePrices | null>(KEY, null)
    const [availablePrices, setAvailablePrices] = useState<AvailablePrices>(
        cachedPrices || [
            {
                id: 1,
                name: "Free",
                monthlyPrice: 0,
                yearlyPrice: 0,
                dataRetentionInMonths: 6,
                dedicatedSupport: false,
                eventsLimit: 1000,
            },
        ],
    )
    const [loaded, setLoaded] = useState(cachedPrices !== null)

    useEffect(() => {
        fetchAuthApi<AvailablePrices>(
            `/checkout/plans`,
            {
                success: (data) => {
                    setLoaded(true)
                    setAvailablePrices(data.data)
                    expirableLocalStorage.set(KEY, data.data)
                },
                error: (err: any) => null,
                catcher: (err: any) => null,
            },
        )
    }, [])

    return {
        availablePrices,
        loaded,
        purchase: (planId: number, period: string, email?: string) => {
            fetchAuthApi<{ path: string }>(
                `/checkout/plan/${planId}/${period}`,
                {
                    success: (data) => {
                        eventTracker.track(
                            "edbecea2-9097-49bb-95ac-70eec9578960",
                            {step: "Choose A Plan", user_id: email},
                        )
                        window.location.href = data.data.path
                    },
                    error: (err: any) => null,
                    catcher: (err: any) => null,
                },
            )
        },
    }
}
