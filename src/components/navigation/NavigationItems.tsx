import React from "react"
import {items} from "./Items"

export default function NavigationItems() {
    return (
            <ul className={"flex flex-row space-x-4"}>
                {items.map(({icon, label, path}, index) => {
                    const current = window.location.pathname === path

                    return (
                            <li key={`${index}_item`}>
                                <a href={path}
                                   className={[
                                       "flex flex-row items-center justify-center transition-all duration-300 hover:bg-[var(--menu-item-hover)] rounded-full px-4 py-2",
                                       (current ? "bg-[var(--menu-item-active)]" : ""),
                                   ].join(" ")}>
                                    {React.createElement(icon, {className: "text-base mr-2"})}
                                    <span className="">{label}</span>
                                </a>
                            </li>
                    )
                })}
            </ul>
    )
}
