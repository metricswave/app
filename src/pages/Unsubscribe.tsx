import {useSearchParams} from "react-router-dom"
import {useEffect, useState} from "react"
import LoadingPage from "./LoadingPage"
import {fetchApi} from "../helpers/ApiFetcher";
import CheckIcon from "../components/icons/CheckIcon";

export default function Unsubscribe() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const [status, setStatus] = useState<"loading" | "done" | "error">("loading")
    const [fetching, setFetching] = useState<boolean>(false)

    useEffect(() => {
        if (fetching) {
            return
        }

        if (token === null) {
            setStatus("error")
            return
        }

        setFetching(true)
        fetchApi(`/users/marketing_mailable?token=${token}`, {
            method: "DELETE",
            success: () => {
                setStatus("done")
            },
            finally: () => {
                if (status === "done") return
                setStatus("error")
            }
        })
    }, []);

    if (status === "loading") {
        return (<LoadingPage/>)
    }

    if (status === "done") {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center space-y-6">
                <CheckIcon className="w-12 h-12"/>
                <div className="text-2xl">You have been unsubscribed from marketing mails.</div>
            </div>
        )
    }

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center space-y-6 ">
            <div className="">404</div>
        </div>
    )
}
