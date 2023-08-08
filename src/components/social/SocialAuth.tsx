import {useState} from "react"
import {Service} from "../../types/Service"
import {connectServiceMethod} from "../services/ConnectServiceMethod"
import {useServicesState} from "../../storage/Services"
import EventTracker from "../../helpers/EventTracker"
import {DeviceName} from "../../storage/DeviceName"

export default function SocialAuth() {
    const [loading, setLoading] = useState(false)
    const {authServices} = useServicesState()

    const connectService = async (service: Service) => {
        setLoading(true)
        EventTracker.track("675c40d3-d5c8-44df-bcb5-7882d1959e45", {step: "oAuth / Form", user_id: DeviceName.name()})
        await connectServiceMethod(service, false)
        setLoading(false)
    }

    return (
        <div className="flex flex-col space-y-4 mb-4">
            {authServices.map((service) => (
                <button
                    key={service.id}
                    onClick={() => connectService(service)}
                    className={[
                        "flex flex-row space-x-4 items-center justify-center",
                        `smooth shadow rounded-full p-3`,
                        "border border-zinc-500 hover:border-blue-600",
                        (loading ? "animate-pulse opacity-70 cursor-not-allowed" : ""),
                    ].join(" ")}>
                    <svg version="1.1"
                         xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 48 48"
                         className="w-7 h-7">
                        <g>
                            <path fill="#EA4335"
                                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                            <path fill="#4285F4"
                                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                            <path fill="#FBBC05"
                                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                            <path fill="#34A853"
                                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            <path fill="none" d="M0 0h48v48H0z"></path>
                        </g>
                    </svg>
                    <span>Connect with Google</span>
                </button>
            ))}
        </div>
    )
}
