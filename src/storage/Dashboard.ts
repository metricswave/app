import {useEffect, useState} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {expirableLocalStorage, THIRTY_SECONDS} from "../helpers/ExpirableLocalStorage"
import {useAuthState} from "./AuthToken"
import {slugify} from "../helpers/Slugify"

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
} & (StatItem | ParameterItem | FunnelItem)

export type DashboardItemType = "stats" | "parameter" | "funnel"

export type DashboardItemSize = "base" | "large"

type StatItem = {
    type: "stats"
}

type ParameterItem = {
    type: "parameter"
    parameter: string
}

type FunnelItem = {
    type: "funnel"
}

const KEY = "nw:dashboards"
let loading = false

export function useDashboardsState() {
    const {logout} = useAuthState()
    const [dashboards, setDashboards] = useState<Dashboard[]>(
        expirableLocalStorage.get<Dashboard[]>(KEY, [], true),
    )

    const reloadDashboards = (force: boolean = false) => {
        if (loading) {
            return
        }

        if (
            expirableLocalStorage.get(KEY, null) !== null
            && dashboards !== undefined
            && dashboards.length > 0
            && !force
        ) {
            return
        }

        loading = true

        fetchAuthApi<Dashboard[]>("/dashboards", {
            success: (data) => {
                loading = false
                expirableLocalStorage.set(KEY, data.data, THIRTY_SECONDS)
                setDashboards(data.data)
            },
            error: (err) => {
                if (err.message === "Unauthenticated.") {
                    logout()
                }
            },
            catcher: (err: any) => loading = false,
        })
    }

    useEffect(reloadDashboards, [])

    const updateDashboard = (index: number, newDashboards: Dashboard[]) => {
        const id = newDashboards[index].id

        fetchAuthApi(`/dashboards/${id}`, {
            method: "PUT",
            body: newDashboards[index],
            success: (data) => {
                expirableLocalStorage.set(KEY, newDashboards, THIRTY_SECONDS)
                reloadDashboards(true)
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
        reloadDashboards,
        publicDashboardPath: (dashboard: Dashboard) => {
            const n = slugify(dashboard.name)
            return `https://app.metricswave.com/${dashboard.uuid}/${n}`
        },
    }
}
