export default function TextButton(props: { href: string, text: string }) {
    return (
            <a href={props.href}
               className="text-blue-500 hover:text-blue-600 animate-all duration-300 py-2 px-4">
                {props.text}
            </a>
    )
}
