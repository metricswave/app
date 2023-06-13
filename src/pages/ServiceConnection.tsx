import {useNavigate, useParams, useSearchParams} from "react-router-dom"
import {useEffect, useState} from "react"
import {fetchApi} from "../helpers/ApiFetcher"
import {DeviceName} from "../storage/DeviceName"
import CircleArrowsIcon from "../components/icons/CircleArrowsIcon"
import {useAuthState} from "../storage/AuthToken"
import {Tokens} from "../types/Token"
import {useUserState} from "../storage/User"

export default function ServiceConnection() {
    const {isAuth} = useAuthState()
    const {user, refreshUser} = useUserState(isAuth)
    const {driver} = useParams()
    const [searchParams] = useSearchParams()
    const [userCreated, setUserCreated] = useState(false)
    const [tokens, setTokens] = useState<Tokens>()
    const navigate = useNavigate()

    useEffect(() => {
        if (tokens === undefined) return
        localStorage.setItem("nw:auth", JSON.stringify(tokens))
        refreshUser()

        if (!userCreated || !user) return

        const referrer = localStorage.getItem("metricswave:referrer") ?? document.referrer
        fetch(`https://metricswave.com/webhooks/f3fcf7cc-416d-4ff9-bc12-3878e9127ff7?email=${user.email}&referrer=${referrer}&step=1`)

        window.location.href = "/welcome"
    }, [userCreated, user, tokens])

    useEffect(() => {
        fetchApi<Tokens>(`/auth/${driver}/callback?${searchParams.toString()}&deviceName=${DeviceName.name()}`, {
            success: (data) => {
                if (!isAuth) {
                    setTokens(data.data)
                    setUserCreated(true)
                    return
                }

                navigate(`/`)
            },
            error: (error) => {
                navigate("/")
            },
            catcher: (e) => {
                navigate("/")
            },
        })
    }, [])

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center space-y-6 animate-pulse">
            <CircleArrowsIcon className="w-12 h-12 animate-spin"/>
        </div>
    )
}
