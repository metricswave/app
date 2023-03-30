import parse from "html-react-parser"

export default function FormErrorMessage({error = false}: { error?: string | false }) {
    if (error === false) return null

    return (<p className="text-red-500 text-sm py-2 text-center">{parse(error)}</p>)
}
