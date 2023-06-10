import React from "react"

export default function SectionContainer({size = "normal", children, ...props}: {
    size?: "normal" | "big" | "extra-big"
    children: React.ReactNode
}) {
    let width = "max-w-[700px]"
    if (size === "big") {
        width = "max-w-[900px]"
    } else if (size === "extra-big") {
        width = "max-w-[1200px]"
    }

    return (
        <div className={
            `mt-1 sm:mt-4 p-6 flex flex-col space-y-4 mx-auto ${width}`
        }>
            {children}
        </div>
    )
}
