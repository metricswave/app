import React from "react"

export default function PageTitle({title, description, ...props}: { title: string, description?: string }) {
    return (
            <div className="mt-7 sm:mt-12 flex flex-col space-y-2 max-w-[700px] mx-auto px-6" {...props}>
                <h1 className="text-lg font-bold">{title}</h1>
                {description && <p className="text-sm opacity-70">{description}</p>}
            </div>
    )
}
