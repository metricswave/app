import React from "react"

type Props = {
    text?: string,
    children?: React.ReactNode,
    loading?: boolean
    size?: "small" | "base",
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function PrimaryButton({text, size = "base", children, loading, className, ...props}: Props) {
    return (
        <button
            {...props}
            className={[
                `smooth shadow rounded-sm text-white border`,
                (size === "small" ? "py-1.5 px-3 text-sm" : "p-3 text-base"),
                (loading ? "animate-pulse bg-zinc-500 border-zinc-500 cursor-not-allowed" : "bg-blue-500 border-blue-500 hover:bg-blue-600"),
                className,
            ].join(" ")}>
            {text ?? children}
        </button>
    )
}
