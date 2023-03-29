export default function LinkButton({href, text}: { href: string, text: string }) {
    return (
            <a href={href}
               className="text-blue-500 hover:text-blue-700 animate-all duration-300">
                {text}
            </a>
    )
}
