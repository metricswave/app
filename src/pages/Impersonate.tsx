import {useNavigate, useSearchParams} from "react-router-dom"
import {useEffect, useState} from "react"
import {useAuthState} from "../storage/AuthToken"
import {Tokens} from "../types/Token"
import LoadingPage from "./LoadingPage"

export default function Impersonate() {
    const {impersonate} = useAuthState()
    const [searchParams] = useSearchParams()
    const [userCreated, setUserCreated] = useState(false)
    const [tokens, setTokens] = useState<Tokens>()
    const navigate = useNavigate()

    useEffect(() => {
        const userId = searchParams.get("user_id") ?? ""
        impersonate(parseInt(userId))
    }, [])

    return (
        <LoadingPage/>
    )
}
