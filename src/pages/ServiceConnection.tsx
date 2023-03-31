import {useNavigate, useParams, useSearchParams} from "react-router-dom"
import {useEffect} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {DeviceName} from "../storage/DeviceName"

export default function ServiceConnection() {
    const {driver} = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        fetchAuthApi(`/auth/${driver}/callback?${searchParams.toString()}&deviceName=${DeviceName.name()}`, {
            success: (data) => {
                navigate(`/services?connected=true&driver=${driver}`)
            },
            error: (error) => {
                console.log(error)
            },
            catcher: (e) => {
                console.log({e})
            },
        })
    })

    return (
            <div>
                Loading …
            </div>
    )
}
