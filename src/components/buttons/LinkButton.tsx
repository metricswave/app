import React from "react"
import ReactMarkdown from "react-markdown"
import {twMerge} from "../../helpers/TwMerge"
import className = ReactMarkdown.propTypes.className

type LinkButtonProps = React.HTMLAttributes<HTMLAnchorElement> & {
    href: string,
    target?: string,
    text?: string,
    children?: React.ReactNode,
    loading?: boolean
}

type NoLinkButtonProps = React.HTMLAttributes<HTMLSpanElement> & Omit<LinkButtonProps, "href">

const classes = "cursor-pointer text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-600 smooth"
const secondaryClasses = "cursor-pointer text-blue-500/50 dark:text-blue-300/50 hover:text-blue-700 dark:hover:text-blue-600 smooth"
const loadingClasses = "text-zinc-500 dark:text-zinc-200 animate-pulse smooth cursor-not-allowed"

const deleteClasses = "text-sm opacity-70 text-red-600 hover:text-red-900 dark:text-red-50/90 dark:hover:text-red-500/90 smooth flex flex-row space-x-2 cursor-pointer"

export function NoLinkButton({text, children, loading, className, ...props}: NoLinkButtonProps) {
    return (
        <span className={(loading ? loadingClasses : classes) + ` ${className}`} {...props}>
           {text ?? children}
       </span>
    )
}

export function SecondaryNoLinkButton({text, children, loading, ...props}: NoLinkButtonProps) {
    return (
        <span className={(loading ? loadingClasses : secondaryClasses) + ` ${className}`} {...props}>
           {text ?? children}
       </span>
    )
}

export function DeleteNoLinkButton({text, children, loading, ...props}: NoLinkButtonProps) {
    return (
        <span className={(loading ? loadingClasses : deleteClasses) + ` ${className}`} {...props}>
           {text ?? children}
       </span>
    )
}

export function LinkButton({href, text, children, loading, className, ...props}: LinkButtonProps) {
    return (
        <a href={href} className={twMerge(
            (loading ? loadingClasses : classes),
            classes,
            className,
        )} {...props}>
            {text ?? children}
        </a>
    )
}

export function SecondaryLinkButton({href, text, children, loading, ...props}: LinkButtonProps) {
    return (
        <a href={href} className={(loading ? loadingClasses : secondaryClasses) + ` ${className}`} {...props}>
            {text ?? children}
        </a>
    )
}
