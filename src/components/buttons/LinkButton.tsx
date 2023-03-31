import React from "react"

type LinkButtonProps = React.HTMLAttributes<HTMLAnchorElement> & {
    href: string,
    text: string,
    loading?: boolean
}

export default function LinkButton({href, text, loading, ...props}: LinkButtonProps) {
    let classes = "text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-600 smooth"

    if (loading) {
        classes = "text-zinc-500 dark:text-zinc-200 animate-pulse smooth cursor-not-allowed"
    }

    return (
            <a href={href} className={classes} {...props}>
                {text}
            </a>
    )
}
