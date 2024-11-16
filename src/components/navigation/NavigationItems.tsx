import React from "react";
import { items } from "./Items";
import { isCurrentRoute } from "../../helpers/Routes";

export default function NavigationItems() {
    return (
        <ul className={"flex flex-row items-center space-x-2"}>
            {items.map(({ icon, label, path }, index) => {
                const current = isCurrentRoute(window.location.pathname, path);

                return (
                    <li key={`${index}_item`}>
                        <a
                            href={path}
                            className={[
                                "flex flex-row items-center justify-center smooth hover:bg-[var(--menu-item-hover)] rounded-full px-4 py-2",
                                current ? "bg-[var(--menu-item-active)]" : "",
                            ].join(" ")}
                        >
                            {React.createElement(icon, { className: "text-base" })}
                            <span className={["ml-2", !current ? "hidden lg:inline-block" : ""].join(" ")}>
                                {label}
                            </span>
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}
