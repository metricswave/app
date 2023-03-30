import React from "react"
import {items} from "./Items"

export default function MobileNavigationItems() {
    return (
            <ul className={"flex flex-row space-x-4 justify-center"}>
                {items.map(({icon, label, path}, index) => {
                    const current = window.location.pathname === path

                    return (
                            <li key={`${index}_item`}>
                                <a href={path}
                                   className={[
                                       "flex flex-row items-center justify-center rounded-full smooth",
                                       (current ? "py-3 px-4 bg-[var(--menu-item-active)] shadow dark:shadow-xl" : "p-3"),
                                   ].join(" ")}>
                                    {React.createElement(icon, {className: "text-xl"})}
                                    {current && <span className="ml-2">{label}</span>}
                                </a>
                            </li>
                    )
                })}
            </ul>
    )
}
