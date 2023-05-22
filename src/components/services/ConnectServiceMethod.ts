import {Service} from "../../types/Service"
import {fetchApi, fetchAuthApi} from "../../helpers/ApiFetcher"

export async function connectServiceMethod(service: Service, isAuth: boolean = false) {
    if (service.configuration.type === "oauth") {
        if (isAuth) {
            await fetchAuthApi<{ path: string }>(`/auth/${service.driver}/redirect`, {
                success: (data) => {
                    window.location.href = data.data.path
                },
                error: (error) => null,
                catcher: () => null,
            })
        } else {
            await fetchApi<{ path: string }>(`/auth/${service.driver}/redirect`, {
                success: (data) => {
                    window.location.href = data.data.path
                },
                error: (error) => null,
                catcher: () => null,
            })
        }
    }
    return false
}
