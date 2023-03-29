import LinkButton from "../components/buttons/LinkButton"

export default function ErrorPage() {
    return (
            <div className="text-center h-screen flex flex-col items-center justify-center">
                <h1 className="text-4xl mb-4">Oops!</h1>
                <p className="mb-2">Something went wrong.</p>
                <p className="opacity-50">Page not found.</p>
                <p className="mt-10">
                    <LinkButton href="/" text={"Go back →"}/>
                </p>
            </div>
    )
}
