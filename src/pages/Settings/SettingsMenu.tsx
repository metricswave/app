import { useAuthState } from "../../storage/AuthToken";
import * as Select from "@radix-ui/react-select";
import { useNavigate } from "react-router-dom";
import { CheckIcon } from "@radix-ui/react-icons";
import ChevronUpIcon from "../../components/icons/ChevronUpIcon";
import ChevronDownIcon from "../../components/icons/ChevronDownIcon";

const panelItems = [
    {
        name: "Profile",
        path: "/settings/profile",
    },
    {
        name: "Site",
        path: "/settings/team",
    },
    {
        name: "Billing",
        path: "/settings/billing",
    },
    {
        name: "Channels",
        path: "/settings/channels",
    },
];

export default function SettingsMenu() {
    const navigate = useNavigate();
    const { logout } = useAuthState();
    const currentItem = panelItems.find((item) => window.location.pathname === item.path) || panelItems[0];

    const setMenuValue = (value: string) => {
        if (value === "/logout") {
            logout();
        } else {
            navigate(value);
        }
    };

    return (
        <>
            {/* Mobile menu */}
            <div className="sm:hidden px-8 pt-8 pb-2">
                <Select.Root value={currentItem.path} onValueChange={setMenuValue}>
                    <Select.Trigger className="w-full inline-flex items-center justify-start rounded leading-none p-3 bg-[var(--form-select-background)] shadow focus:outline-blue-500 focus:outline data-[placeholder]:text-zinc-500 outline-none space-x-4">
                        <Select.Icon className="">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>
                        </Select.Icon>
                        <Select.Value placeholder={currentItem.name} />
                    </Select.Trigger>

                    <Select.Portal className="drop-shadow rounded p-4 max-w-screen">
                        <Select.Content className="overflow-hidden bg-[var(--form-select-content-background)] rounded-md shadow w-full z-50">
                            <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white cursor-default">
                                <ChevronUpIcon />
                            </Select.ScrollUpButton>
                            <Select.Viewport className="p-[5px]">
                                <Select.Group>
                                    {panelItems.map((item) => (
                                        <Select.Item
                                            key={item.path}
                                            value={item.path}
                                            className="leading-none flex items-center relative select-none data-[disabled]:pointer-events-none py-3 pr-3 pl-[50px] data-[disabled]:text-zinc-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-[var(--form-select-item-background)] rounded-sm"
                                        >
                                            <Select.ItemText>{item.name}</Select.ItemText>
                                            <Select.ItemIndicator className="absolute left-2 w-[25px] inline-flex items-center justify-center">
                                                <CheckIcon />
                                            </Select.ItemIndicator>
                                        </Select.Item>
                                    ))}
                                </Select.Group>

                                <Select.Separator className="pt-3 mb-3 border-b border-zinc-200/50 dark:border-zinc-700" />

                                <Select.Group>
                                    <Select.Item
                                        value="/logout"
                                        className="leading-none flex items-center relative select-none data-[disabled]:pointer-events-none py-3 pr-3 pl-[50px] data-[disabled]:text-zinc-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-[var(--form-select-item-background)] rounded-sm"
                                    >
                                        <Select.ItemText>Log out</Select.ItemText>
                                        <Select.ItemIndicator className="absolute left-2 w-[25px] inline-flex items-center justify-center">
                                            <CheckIcon />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                </Select.Group>
                            </Select.Viewport>
                            <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white cursor-default">
                                <ChevronDownIcon />
                            </Select.ScrollDownButton>
                        </Select.Content>
                    </Select.Portal>
                </Select.Root>
            </div>

            {/* Sidebar */}
            <div className="border-r soft-border p-8 min-h-screen flex-col space-y-8 min-w-[200px] hidden sm:flex">
                <h1 className="font-bold">Settings</h1>

                <ul className="flex flex-col space-y-4">
                    {panelItems.map((item) => {
                        const current = window.location.pathname === item.path;

                        return (
                            <li key={item.path}>
                                <a
                                    className={[current ? "opacity-100" : "opacity-50 hover:opacity-80"].join(" ")}
                                    href={item.path}
                                >
                                    {item.name}
                                </a>
                            </li>
                        );
                    })}
                </ul>

                <ul className="flex flex-col space-y-2">
                    <li>
                        <a
                            href="/"
                            className="opacity-50 hover:text-red-500 hover:opacity-80"
                            onClick={(e) => {
                                e.preventDefault();
                                logout();
                            }}
                        >
                            Log out →
                        </a>
                    </li>
                </ul>
            </div>
        </>
    );
}
