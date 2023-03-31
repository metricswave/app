import {useNavigate, useParams, useSearchParams} from "react-router-dom"
import {useEffect} from "react"
import {fetchAuthApi} from "../helpers/ApiFetcher"
import {DeviceName} from "../storage/DeviceName"
import CircleArrowsIcon from "../components/icons/CircleArrowsIcon"

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
                navigate("/")
            },
            catcher: (e) => {
                navigate("/")
            },
        })
    })

    return (
            <div className="h-screen w-full flex flex-col items-center justify-center space-y-6 animate-pulse">
                <CircleArrowsIcon className="w-12 h-12 animate-spin"/>
            </div>
    )
}
