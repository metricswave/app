import {useNavigate, useParams, useSearchParams} from "react-router-dom"
import {useEffect, useState} from "react"
import {fetchApi} from "../helpers/ApiFetcher"
import {DeviceName} from "../storage/DeviceName"
import {useAuthState} from "../storage/AuthToken"
import {Tokens} from "../types/Token"
import EventTracker from "../helpers/EventTracker"
import LoadingPage from "./LoadingPage"
import {useAuthContext} from "../contexts/AuthContext";

export default function ServiceConnection() {
    const {isAuth} = useAuthState()
    const {user, refreshUser} = useAuthContext().userState
    const {driver} = useParams()
    const [searchParams] = useSearchParams()
    const [userCreated, setUserCreated] = useState(false)
    const [tokens, setTokens] = useState<Tokens>()
    const navigate = useNavigate()

    useEffect(() => {
        if (tokens === undefined) return
        localStorage.setItem("nw:auth", JSON.stringify(tokens))
        refreshUser()

        if (!user) return

        if (userCreated) {
            EventTracker.track("675c40d3-d5c8-44df-bcb5-7882d1959e45", {step: "Logged", user_id: DeviceName.name()})
            const referrer = localStorage.getItem("metricswave:referrer") ?? document.referrer
            EventTracker.track("f3fcf7cc-416d-4ff9-bc12-3878e9127ff7", {email: user?.email, referrer, step: 1})
        }

        window.location.href = "/welcome"
    }, [userCreated, user, tokens])

    useEffect(() => {
        fetchApi<Tokens>(`/auth/${driver}/callback?${searchParams.toString()}&deviceName=${DeviceName.name()}`, {
            success: (data, status) => {
                if (!isAuth) {
                    setTokens(data.data)
                    setUserCreated(status === 201)
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
        <LoadingPage/>
    )
}
