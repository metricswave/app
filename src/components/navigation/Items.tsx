import { DashboardIcon, LightningBoltIcon, ListBulletIcon } from "@radix-ui/react-icons";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { User } from "../../types/User";

type NavItem = {
    icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
    label: string;
    path: string;
    enable?: (user: User) => boolean;
};

export const items: Array<NavItem> = [
    {
        icon: DashboardIcon,
        label: "Dashboards",
        path: "/",
    },
    {
        icon: ListBulletIcon,
        label: "Users",
        path: "/realtime",
    },
    {
        icon: LightningBoltIcon,
        label: "Events",
        path: "/events",
    },
];
