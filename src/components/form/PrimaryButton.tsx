import React from "react"

type Props = {
    text: string,
    loading?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function PrimaryButton({text, loading, className, ...props}: Props) {
    return (
            <button
                    {...props}
                    className={[
                        `smooth shadow rounded-sm p-3 text-white`,
                        (loading ? "animate-pulse bg-zinc-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"),
                        className,
                    ].join(" ")}>
                {text}
            </button>
    )
}
