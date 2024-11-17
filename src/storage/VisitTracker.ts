import { useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";

export const TrackVisit = function () {
    const { user } = useAuthContext().userState;

    useEffect(() => {
        window.metricswave.setUserId(user?.email ?? null);
    }, [user]);
};
