export default function LinkButton({href, text}: { href: string, text: string }) {
    return (
            <a href={href}
               className="text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-600 smooth">
                {text}
            </a>
    )
}
