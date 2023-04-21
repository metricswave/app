import React from "react"

type Props = {
    children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export default function BlockContainer({children, ...props}: Props) {
    return (
            <div {...props}
                 className="
                    flex flex-row space-x-4 items-start p-4
                    border rounded-sm soft-border hover:border-zinc-400/30
                    hover:bg-blue-100/30 active:bg-blue-100/40 hover:active:bg-blue-100/40
                    dark:hover:bg-zinc-50/5 dark:active:bg-zinc-50/10 dark:active:hover:bg-zinc-50/10
                    active:border-blue-400/50 active:hover:border-blue-400/50 dark:active:border-blue-900
                    smooth cursor-pointer">
                {children}
            </div>
    )
}
