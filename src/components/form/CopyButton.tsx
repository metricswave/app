import React from "react"

type Props = {
    textToCopy: string,
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function CopyButton({textToCopy, className, ...props}: Props) {
    const [copied, setCopied] = React.useState(false)

    const copy = () => {
        navigator.clipboard.writeText(textToCopy)
        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
    }

    return (
            <button
                    {...props}
                    onClick={copy}
                    className={[
                        "smooth rounded-sm p-3 text-blue-500 border soft-border hover:bg-blue-50 hover:dark:bg-blue-900/10",
                        className,
                    ].join(" ")}>
                {copied ? "Copied!" : "Copy"}
            </button>
    )
}
