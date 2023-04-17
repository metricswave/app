import React from "react"

type Props = {
    children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export default function BlockContainer({children, ...props}: Props) {
    return (
            <div {...props}
                 className="flex flex-row space-x-4 items-start p-4 border rounded-sm soft-border hover:bg-blue-100/75 hover:border-blue-100 hover:bg-zinc-50/5 hover:border-blue-50/20 active:bg-blue-100/75 active:border-blue-100 smooth cursor-pointer">
                {children}
            </div>
    )
}
