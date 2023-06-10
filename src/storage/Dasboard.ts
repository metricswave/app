import {useState} from "react"

export type Dashboard = {
    id: string
    name: string
    items: DashboardItem[]
}

export type DashboardItem = {
    eventUuid: string
    title: string
    size: DashboardItemSize
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

export function useDashboardsState() {
    const [dashboards, setDashboards] = useState<Dashboard[]>([
        {
            id: "1",
            name: "Default",
            items: [
                {
                    eventUuid: "29c31fab-a1c6-491d-92ff-081e69744651",
                    title: "New Leads",
                    size: "large",
                    type: "stats",
                },
                {
                    eventUuid: "fbe17995-b16b-45d5-b33e-7a43b9a41313",
                    title: "Landing Visits",
                    size: "base",
                    type: "stats",
                },
                {
                    eventUuid: "f41ff0fd-4475-499c-b086-82d6012bbf16",
                    title: "App Visits",
                    size: "base",
                    type: "stats",
                },
                {
                    eventUuid: "fbe17995-b16b-45d5-b33e-7a43b9a41313",
                    title: "Landing Visits by Path",
                    size: "base",
                    type: "parameter",
                    parameter: "path",
                },
                {
                    eventUuid: "f41ff0fd-4475-499c-b086-82d6012bbf16",
                    title: "App Visits by Path",
                    size: "base",
                    type: "parameter",
                    parameter: "path",
                },
            ],
        },
    ])

    const addWidgetToDashboard = (dashboardIndex: number, item: DashboardItem) => {
        const dashboard = dashboards[dashboardIndex]
        const newDashboard = {
            ...dashboard,
            items: [...dashboard.items, item],
        }
        const newDashboards = [...dashboards]
        newDashboards[dashboardIndex] = newDashboard
        setDashboards(newDashboards)
    }

    return {
        dashboards,
        addWidgetToDashboard,
    }
}
