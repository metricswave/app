import { expirableLocalStorage, TEN_MINUTES_SECONDS } from "../helpers/ExpirableLocalStorage";
import { useEffect, useState } from "react";
import { Service } from "../types/Service";
import { fetchApi } from "../helpers/ApiFetcher";

const SERVICES_KEY: string = "nw:services";
const SERVICES_REFRESH_KEY: string = "nw:service:refresh";

export function useServicesState() {
    const [services, setServices] = useState<Service[]>(expirableLocalStorage.get(SERVICES_KEY, []));
    const [isFresh, setIsFresh] = useState<boolean>(expirableLocalStorage.get(SERVICES_REFRESH_KEY, false));

    useEffect(() => {
        if (isFresh) return;

        fetchApi<{ services: Service[] }>("/services", {
            success: (data) => {
                setServices(data.data.services);
                setIsFresh(true);
                expirableLocalStorage.set(SERVICES_KEY, data.data.services);
                expirableLocalStorage.set(SERVICES_REFRESH_KEY, true, TEN_MINUTES_SECONDS);
            },
            error: (data) => setIsFresh(false),
            catcher: (data) => setIsFresh(false),
        });
    }, [isFresh]);

    return {
        services: services.filter((s) => s.driver === "stripe" || s.driver === "telegram"),
        authServices: services.filter((s) => s.driver === "google"),
        reloadServices: () => setIsFresh(false),
    };
}
