import React from "react"

export default function SectionContainer({size = "normal", children, ...props}: {
    size?: "normal" | "big",
    children: React.ReactNode
}) {
    const width = size === "normal" ? "max-w-[700px]" : "max-w-[900px]"

    return (
        <div className={
            `mt-1 sm:mt-4 p-6 flex flex-col space-y-4 mx-auto ${width}`
        }>
            {children}
        </div>
    )
}
