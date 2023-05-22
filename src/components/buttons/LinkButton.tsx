import React from "react"
import ReactMarkdown from "react-markdown"
import className = ReactMarkdown.propTypes.className

type LinkButtonProps = React.HTMLAttributes<HTMLAnchorElement> & {
    href: string,
    target?: string,
    text: string,
    loading?: boolean
}

type NoLinkButtonProps = React.HTMLAttributes<HTMLSpanElement> & Omit<LinkButtonProps, "href">

const classes = "cursor-pointer text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-600 smooth"
const secondaryClasses = "cursor-pointer text-blue-500/50 dark:text-blue-300/50 hover:text-blue-700 dark:hover:text-blue-600 smooth"
const loadingClasses = "text-zinc-500 dark:text-zinc-200 animate-pulse smooth cursor-not-allowed"

const deleteClasses = "text-sm opacity-70 text-red-600 hover:text-red-900 dark:text-red-50/90 dark:hover:text-red-500/90 smooth flex flex-row space-x-2 cursor-pointer"

export function NoLinkButton({text, loading, className, ...props}: NoLinkButtonProps) {
    return (
            <span className={(loading ? loadingClasses : classes) + ` ${className}`} {...props}>
           {text}
       </span>
    )
}

export function SecondaryNoLinkButton({text, loading, ...props}: NoLinkButtonProps) {
    return (
            <span className={(loading ? loadingClasses : secondaryClasses) + ` ${className}`} {...props}>
           {text}
       </span>
    )
}

export function DeleteNoLinkButton({text, loading, ...props}: NoLinkButtonProps) {
    return (
            <span className={(loading ? loadingClasses : deleteClasses) + ` ${className}`} {...props}>
           {text}
       </span>
    )
}

export function LinkButton({href, text, loading, ...props}: LinkButtonProps) {
    return (
            <a href={href} className={(loading ? loadingClasses : classes) + ` ${className}`} {...props}>
                {text}
            </a>
    )
}

export function SecondaryLinkButton({href, text, loading, ...props}: LinkButtonProps) {
    return (
            <a href={href} className={(loading ? loadingClasses : secondaryClasses) + ` ${className}`} {...props}>
                {text}
            </a>
    )
}
