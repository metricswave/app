import {app} from "../config/app"
import {Tokens} from "../types/Token"

type ApiResponse<T> = {
    data: T
}

type ApiErrorResponse = {
    message: string
}

type ApiFetcherParams<T> = {
    method?: "GET" | "POST"
    body?: object
    success: (data: ApiResponse<T>) => void
    error: (data: ApiErrorResponse) => void
    catcher: (err: Error) => void
}

// todo: We should get token from localStorage in one place only. Extract useState from App to somewhere.
const tokens = localStorage.getItem("nw:auth")
    ? JSON.parse(localStorage.getItem("nw:auth") as string) as Tokens
    : null

export function fetchAuthApi<T>(path: string, {method = "GET", ...params}: ApiFetcherParams<T>) {
    fetch(`${app.api}${path}`, {
        method,
        body: JSON.stringify(params.body),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${tokens!.token.token}`,
        },
    })
        .then(async res => {
            if (res.status >= 200 && res.status < 300) {
                const data = await res.json()
                params.success(data)
            }

            const err = await res.json()
            params.error(err)
        })
        .catch(params.catcher)
}

export function fetchApi<T>(path: string, {method = "GET", ...params}: ApiFetcherParams<T>) {
    fetch(`${app.api}${path}`, {
        method,
        body: JSON.stringify(params.body),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    })
        .then(async res => {
            if (res.status >= 200 && res.status < 300) {
                const data = await res.json()
                params.success(data)
            }

            const err = await res.json()
            params.error(err)
        })
        .catch(params.catcher)
}
