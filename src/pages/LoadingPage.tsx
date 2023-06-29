import CircleArrowsIcon from "../components/icons/CircleArrowsIcon"

export default function LoadingPage() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center space-y-6 animate-pulse">
            <CircleArrowsIcon className="w-12 h-12 animate-spin"/>
        </div>
    )
}
