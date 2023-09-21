import React from "react"
import {twMerge} from "../../helpers/TwMerge"

export default function SectionContainer({size = "normal", align = "center", children, className, ...props}: {
    size?: "normal" | "big" | "extra-big"
    align?: "left" | "center"
    children: React.ReactNode
    className?: string
}) {
    let width = "max-w-[700px]"
    if (size === "big") {
        width = "max-w-[900px]"
    } else if (size === "extra-big") {
        width = "max-w-[1200px]"
    }

    return (
        <div className={
            twMerge(
                `mt-1 sm:mt-4 p-6 flex flex-col space-y-4 ${width}`,
                {"mx-auto": align === "center"},
                className,
            )
        }>
            {children}
        </div>
    )
}
