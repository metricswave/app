import {useEffect, useState} from "react"
import {expirableLocalStorage} from "../helpers/ExpirableLocalStorage"
import {fetchAuthApi} from "../helpers/ApiFetcher"

const KEY = "nw:available-prices"

type AvailablePrices = {
    monthly: Price,
    lifetime: Price,
}

type Price = {
    id: number,
    price: number,
    remaining: number,
    total_available: number,
    type: "monthly" | "lifetime",
}

export function useAvailablePricesState() {
    const cachedPrices = expirableLocalStorage.get<AvailablePrices | null>(KEY, null)
    const [availablePrices, setAvailablePrices] = useState<AvailablePrices>(
        cachedPrices || {
            monthly: {
                price: 0,
                remaining: 0,
                total_available: 0,
                type: "monthly",
            },
            lifetime: {
                price: 0,
                remaining: 0,
                total_available: 0,
                type: "lifetime",
            },
        },
    )
    const [loaded, setLoaded] = useState(cachedPrices !== null)

    useEffect(() => {
        fetchAuthApi<AvailablePrices>(
            `/checkout/prices`,
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
        purchase: (priceId: number) => {
            fetchAuthApi<{ path: string }>(
                `/checkout/prices/${priceId}`,
                {
                    success: (data) => {
                        window.location.href = data.data.path
                    },
                    error: (err: any) => null,
                    catcher: (err: any) => null,
                },
            )
        },
    }
}
