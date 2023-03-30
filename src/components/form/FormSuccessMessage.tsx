import parse from "html-react-parser"

export default function FormSuccessMessage({message = false}: { message?: string | false }) {
    if (message === false) return null

    return (<p className="text-green-500 text-sm py-2 text-center">{parse(message)}</p>)
}
