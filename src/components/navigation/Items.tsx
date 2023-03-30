import NotificationIcon from "../icons/NotificationIcon"
import TriggerIcon from "../icons/TriggerIcon"
import ServicesIcon from "../icons/ServicesIcon"

type NavItem = {
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
    label: string,
    path: string,
}

export const items: Array<NavItem> = [
    {
        icon: NotificationIcon,
        label: "Notifications",
        path: "/",
    },
    {
        icon: TriggerIcon,
        label: "Triggers",
        path: "/triggers",
    },
    {
        icon: ServicesIcon,
        label: "Services",
        path: "/services",
    },
]
