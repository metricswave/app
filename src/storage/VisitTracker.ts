import {useLocation} from "react-router-dom"

export const TrackVisit = function () {
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)

    // useEffect(() => {
    //     const params = {
    //         path: location.pathname,
    //         referrer: searchParams.get("utm_source") ?? document.referrer,
    //     }
    //
    //     if (!app.isProduction) {
    //         console.log("VisitTracker", params)
    //         return
    //     }
    //
    //     const path = "https://notifywave.com/webhooks/f41ff0fd-4475-499c-b086-82d6012bbf16"
    //
    //     fetch(path, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Accept": "application/json",
    //         },
    //         body: JSON.stringify(params),
    //     })
    // }, [location])
}
