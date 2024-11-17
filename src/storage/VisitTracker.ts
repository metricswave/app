import { useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";

export const TrackVisit = function () {
    const { user } = useAuthContext().userState;

    useEffect(() => {
        window.metricswave.setUser(user?.email ?? null);
    }, [user]);
};
