export type Dashboard = {
    id: string;
    name: string;
    uuid: string;
    public: boolean;
    items: DashboardItem[];
};

export type DashboardItem = {
    eventUuid: string;
    title: string;
    size: DashboardItemSize;
    parameter?: string;
    otherEvents?: string[];
} & (StatItem | ParameterItem | FunnelItem | NumberItem);

export type DashboardItemType = "stats" | "parameter" | "funnel" | "number";

export type DashboardItemSize = "base" | "large";

export type StatItem = {
    type: "stats";
    otherEvents: string[];
};

export type ParameterItem = {
    type: "parameter";
    parameter: string;
};

export type FunnelItem = {
    type: "funnel";
};

export type NumberItem = {
    type: "number";
};
