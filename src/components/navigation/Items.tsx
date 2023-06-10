import {DashboardIcon, LightningBoltIcon, PaperPlaneIcon} from "@radix-ui/react-icons"
import React, {ForwardRefExoticComponent, RefAttributes} from "react"
import {IconProps} from "@radix-ui/react-icons/dist/types"

type NavItem = {
    icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>,
    label: string,
    path: string,
}

export const items: Array<NavItem> = [
    {
        icon: DashboardIcon,
        label: "Dashboards",
        path: "/",
    },
    {
        icon: LightningBoltIcon,
        label: "Events",
        path: "/events",
    },
    {
        icon: PaperPlaneIcon,
        label: "Services",
        path: "/services",
    },
]
