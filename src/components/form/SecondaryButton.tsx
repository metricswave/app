import React from "react"

type Props = {
    text?: string,
    children?: React.ReactNode,
    loading?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function SecondaryButton({text, children, loading, className, ...props}: Props) {
    return (
        <button
            {...props}
            className={[
                `smooth shadow rounded-sm p-3 text-blue-500 hover:text-white border`,
                (loading ? "animate-pulse bg-zinc-500 border-zinc-500 cursor-not-allowed" : "border-blue-500 hover:bg-blue-600"),
                className,
            ].join(" ")}>
            {text ?? children}
        </button>
    )
}
