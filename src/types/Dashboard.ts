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

export type StatItem = {
    type: "stats"
}

export type ParameterItem = {
    type: "parameter"
    parameter: string
}

export type FunnelItem = {
    type: "funnel"
}
