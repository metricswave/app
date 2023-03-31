import React from "react"

export default function PageTitle({title, description, ...props}: { title: string, description?: string }) {
    return (
            <div className="mx-8 mt-7 flex flex-col space-y-2" {...props}>
                <h1 className="text-lg font-bold">{title}</h1>
                {description && <p className="text-sm opacity-70">{description}</p>}
            </div>
    )
}
