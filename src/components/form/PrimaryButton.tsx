export default function PrimaryButton({text, loading}: { text: string, loading?: boolean }) {
    return (
            <button className={
                    `smooth shadow rounded-sm p-3 text-white ` +
                    (loading ? "animate-pulse bg-zinc-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600")
            }>
                {text}
            </button>
    )
}
