import { useEffect, useState } from "react";
import { fetchAuthApi } from "../helpers/ApiFetcher";
import { expirableLocalStorage, THIRTY_SECONDS } from "../helpers/ExpirableLocalStorage";
import { useAuthState } from "./AuthToken";
import { slugify } from "../helpers/Slugify";
import { Dashboard, DashboardItem } from "../types/Dashboard";
import { useAuthContext } from "../contexts/AuthContext";

export const publicDashboardPath = (dashboard: Dashboard) => {
    const n = slugify(dashboard.name);
    return `https://app.metricswave.com/${dashboard.uuid}/${n}`;
};

export function useDashboardsState() {
    const { teamState } = useAuthContext();
    const { currentTeamId } = teamState;
    const [loading, setLoading] = useState(false);
    const KEY = () => `nw:${currentTeamId}:dashboards`;

    const { logout } = useAuthState();
    const [dashboards, setDashboards] = useState<Dashboard[]>(expirableLocalStorage.get<Dashboard[]>(KEY(), [], true));

    const reloadDashboards = (force: boolean = false) => {
        if (loading) return;

        const cachesDashboardsForTeam = expirableLocalStorage.get<Dashboard[] | null>(KEY(), null);

        if (cachesDashboardsForTeam !== null && dashboards !== undefined && dashboards.length > 0 && !force) {
            setDashboards(cachesDashboardsForTeam);
            return;
        }

        if (currentTeamId === null) {
            return;
        }

        setLoading(true);
        fetchAuthApi<Dashboard[]>(`/${currentTeamId}/dashboards`, {
            success: (data) => {
                setLoading(false);
                expirableLocalStorage.set(KEY(), data.data, THIRTY_SECONDS);
                setDashboards(data.data);
            },
            error: (err) => {
                if (err.message === "Unauthenticated.") {
                    logout();
                }
            },
            finally: () => {
                setLoading(false);
            },
        });
    };

    useEffect(reloadDashboards, [currentTeamId]);

    const updateDashboard = (index: number, newDashboards: Dashboard[]) => {
        const id = newDashboards[index].id;

        fetchAuthApi(`/dashboards/${id}`, {
            method: "PUT",
            body: newDashboards[index],
            success: (data) => {
                expirableLocalStorage.set(KEY(), newDashboards, THIRTY_SECONDS);
                reloadDashboards(true);
            },
            error: (err: any) => null,
            catcher: (err: any) => null,
        });
    };

    const addWidgetToDashboard = (dashboardIndex: number, item: DashboardItem) => {
        const dashboard = dashboards[dashboardIndex];
        const newDashboard = {
            ...dashboard,
            items: [...dashboard.items, item],
        };
        const newDashboards = [...dashboards];
        newDashboards[dashboardIndex] = newDashboard;
        setDashboards(newDashboards);
        updateDashboard(dashboardIndex, newDashboards);
    };

    const removeWidgetFromDashboard = (dashboardIndex: number, itemIndex: number) => {
        const dashboard = dashboards[dashboardIndex];
        const newDashboard = {
            ...dashboard,
            items: [...dashboard.items],
        };
        newDashboard.items.splice(itemIndex, 1);
        const newDashboards = [...dashboards];
        newDashboards[dashboardIndex] = newDashboard;
        setDashboards(newDashboards);
        updateDashboard(dashboardIndex, newDashboards);
    };

    const updateDashboardFields = (dashboardIndex: number, fields: Partial<Dashboard>) => {
        const dashboard = dashboards[dashboardIndex];
        const newDashboard = {
            ...dashboard,
            ...fields,
        };
        const newDashboards = [...dashboards];
        newDashboards[dashboardIndex] = newDashboard;
        setDashboards(newDashboards);
        updateDashboard(dashboardIndex, newDashboards);
    };

    return {
        dashboards,
        addWidgetToDashboard,
        removeWidgetFromDashboard,
        updateDashboard: updateDashboardFields,
        reloadDashboards,
    };
}
