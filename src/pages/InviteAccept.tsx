import {useNavigate, useSearchParams} from "react-router-dom"
import {useEffect, useState} from "react"
import LoadingPage from "./LoadingPage"
import {fetchApi} from "../helpers/ApiFetcher";
import CircleArrowsIcon from "../components/icons/CircleArrowsIcon";

export default function ServiceConnection() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get("token")
    const teamId = searchParams.get("team")
    const [status, setStatus] = useState<"loading" | "accepted" | "error">("loading")
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchApi(`/teams/${teamId}/invites/${token}/accept`, {
            method: "POST",
            success: () => {
                setStatus("accepted")
                setTimeout(() => navigate("/"), 2000)
            },
            error: (err, status) => {
                if (status === 400) {
                    setError(err.message)
                }
            },
            finally: () => {
                setStatus("error")
            }
        })
    }, []);

    if (status === "loading") {
        return (<LoadingPage/>)
    }

    if (status === "accepted") {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center space-y-6 animate-pulse">
                <CircleArrowsIcon className="w-12 h-12 animate-spin"/>
                <div className="text-2xl">You have been added to the team.</div>
                <div className="">Redirecting to Dashboard…</div>
            </div>
        )
    }

    if (status === "error" && error) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center space-y-6 ">
                <div className="">First you need to create your account and then accept the invitation.</div>
                <div className="">
                    <a href="/"
                       className="text-blue-500 hover:underline smooth-all">Create your account</a>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center space-y-6 ">
            <div className="">This invitation have been revoked or the link is wrong.</div>
            <div className="">Try again or talk to the team owner.</div>
        </div>
    )
}
