import {useEffect, useState} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"

export type Dashboard = {
    id: string
    name: string
    uuid: string
    public: boolean
    items: DashboardItem[]
}

export type DashboardItem = {
    eventUuid: string
    title: string
    size: DashboardItemSize
    parameter?: string
} & (StatItem | ParameterItem)

export type DashboardItemType = "stats" | "parameter"

export type DashboardItemSize = "base" | "large"

type StatItem = {
    type: "stats"
}

type ParameterItem = {
    type: "parameter"
    parameter: string
}

const KEY = "nw:dashboards"

export function useDashboardsState() {
    const [dashboards, setDashboards] = useState<Dashboard[]>(
        JSON.parse(localStorage.getItem(KEY) || "[]"),
    )

    useEffect(() => {
        fetchAuthApi<Dashboard[]>("/dashboards", {
            success: (data) => {
                localStorage.setItem(KEY, JSON.stringify(data.data))
                setDashboards(data.data)
            },
            error: (err: any) => null,
            catcher: (err: any) => null,
        })
    }, [])

    const updateDashboard = (index: number, newDashboards: Dashboard[]) => {
        const id = newDashboards[index].id

        fetchAuthApi(`/dashboards/${id}`, {
            method: "PUT",
            body: newDashboards[index],
            success: (data) => {
                localStorage.setItem(KEY, JSON.stringify(newDashboards))
            },
            error: (err: any) => null,
            catcher: (err: any) => null,
        })
    }

    const addWidgetToDashboard = (dashboardIndex: number, item: DashboardItem) => {
        const dashboard = dashboards[dashboardIndex]
        const newDashboard = {
            ...dashboard,
            items: [...dashboard.items, item],
        }
        const newDashboards = [...dashboards]
        newDashboards[dashboardIndex] = newDashboard
        setDashboards(newDashboards)
        updateDashboard(dashboardIndex, newDashboards)
    }

    const removeWidgetFromDashboard = (dashboardIndex: number, itemIndex: number) => {
        const dashboard = dashboards[dashboardIndex]
        const newDashboard = {
            ...dashboard,
            items: [...dashboard.items],
        }
        newDashboard.items.splice(itemIndex, 1)
        const newDashboards = [...dashboards]
        newDashboards[dashboardIndex] = newDashboard
        setDashboards(newDashboards)
        updateDashboard(dashboardIndex, newDashboards)
    }

    const updateDashboardFields = (dashboardIndex: number, fields: Partial<Dashboard>) => {
        const dashboard = dashboards[dashboardIndex]
        const newDashboard = {
            ...dashboard,
            ...fields,
        }
        const newDashboards = [...dashboards]
        newDashboards[dashboardIndex] = newDashboard
        setDashboards(newDashboards)
        updateDashboard(dashboardIndex, newDashboards)
    }

    return {
        dashboards,
        addWidgetToDashboard,
        removeWidgetFromDashboard,
        updateDashboard: updateDashboardFields,
        publicDashboardPath: (dashboard: Dashboard) => `https://app.metricswave.com/${dashboard.uuid}/${dashboard.name}`,
    }
}
