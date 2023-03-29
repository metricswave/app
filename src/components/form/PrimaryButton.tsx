export default function PrimaryButton({text}: { text: string }) {
    return (
            <button className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 shadow rounded-sm p-3 text-white">
                {text}
            </button>
    )
}
