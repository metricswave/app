import { useEffect, useState } from "react";
import { expirableLocalStorage } from "../helpers/ExpirableLocalStorage";
import { fetchAuthApi } from "../helpers/ApiFetcher";
import eventTracker from "../helpers/EventTracker";
import { TeamId } from "../types/Team";
import { BasicPeriod } from "../types/Period";

const KEY = "nw:available-plans";
let loading = false;

type AvailablePrices = Plan[];

export type Plan = {
    id: number;
    name: "Free" | "Basic" | "Starter" | "Business" | "Corporate" | "Enterprise";
    monthlyPrice: number;
    yearlyPrice: number;
    dataRetentionInMonths: number | null;
    dedicatedSupport: boolean;
    eventsLimit: number | null;
};

export function planPrice(plan: Plan, type: BasicPeriod): number {
    if (type === "monthly") {
        return plan.monthlyPrice;
    } else {
        return plan.yearlyPrice / 12;
    }
}

export function useAvailablePricesState() {
    const cachedPrices = expirableLocalStorage.get<AvailablePrices | null>(KEY, null);
    const [availablePrices, setAvailablePrices] = useState<AvailablePrices>(
        cachedPrices || [
            {
                id: 1,
                name: "Free",
                monthlyPrice: 0,
                yearlyPrice: 0,
                dataRetentionInMonths: 6,
                dedicatedSupport: false,
                eventsLimit: 1_000_000,
            },
        ],
    );
    const [loaded, setLoaded] = useState(cachedPrices !== null);

    useEffect(() => {
        if (loading) return;
        loading = true;

        fetchAuthApi<AvailablePrices>(`/checkout/plans`, {
            success: (data) => {
                setLoaded(true);
                setAvailablePrices(data.data);
                expirableLocalStorage.set(KEY, data.data);
                loading = false;
            },
            error: (err: any) => (loading = false),
            catcher: (err: any) => (loading = false),
        });
    }, []);

    return {
        availablePrices,
        loaded,
        purchase: (teamId: TeamId, planId: number, period: string, email?: string) => {
            fetchAuthApi<{ path: string }>(`/${teamId}/checkout/plan/${planId}/${period}`, {
                success: (data) => {
                    eventTracker.track("edbecea2-9097-49bb-95ac-70eec9578960", {
                        step: "Choose A Plan",
                        user_id: email,
                    });
                    window.location.href = data.data.path;
                },
                error: (err: any) => null,
                catcher: (err: any) => null,
            });
        },
    };
}
