import { useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";

export const TrackVisit = function () {
    const { user } = useAuthContext().userState;

    useEffect(() => {
        if (window.metricswave !== undefined && typeof window.metricswave.setUser === "function") {
            window.metricswave.setUser(user?.email ?? null);
        }
    }, [user]);
};
