import React from "react"

type LinkButtonProps = React.HTMLAttributes<HTMLAnchorElement> & {
    href: string,
    text: string,
    loading?: boolean
}

type NoLinkButtonProps = React.HTMLAttributes<HTMLSpanElement> & Omit<LinkButtonProps, "href">

const classes = "cursor-pointer text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-600 smooth"
const secondaryClasses = "cursor-pointer text-blue-500/50 dark:text-blue-300/50 hover:text-blue-700 dark:hover:text-blue-600 smooth"
const loadingClasses = "text-zinc-500 dark:text-zinc-200 animate-pulse smooth cursor-not-allowed"

export function NoLinkButton({text, loading, ...props}: NoLinkButtonProps) {
    return (
            <span className={loading ? loadingClasses : classes} {...props}>
           {text}
       </span>
    )
}

export function SecondaryNoLinkButton({text, loading, ...props}: NoLinkButtonProps) {
    return (
            <span className={loading ? loadingClasses : secondaryClasses} {...props}>
           {text}
       </span>
    )
}

export function LinkButton({href, text, loading, ...props}: LinkButtonProps) {
    return (
            <a href={href} className={classes} {...props}>
                {text}
            </a>
    )
}
