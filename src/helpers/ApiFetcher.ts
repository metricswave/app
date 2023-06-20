import {app} from "../config/app"
import {getTokens} from "../storage/AuthToken"

export type ApiResponse<T> = {
    data: T
}

type ApiErrorResponse = {
    message: string,
    errors?: { [key: string]: string[] }
}

type ApiFetcherParams<T> = {
    method?: "GET" | "POST" | "PUT" | "DELETE"
    body?: object
    refreshToken?: boolean
    success: (data: ApiResponse<T>) => void
    error: (data: ApiErrorResponse) => void
    catcher: (err: Error) => void
}

const defaultHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "x-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
}

export function fetchAuthApi<T>(path: string, {
    method = "GET",
    refreshToken = false,
    ...params
}: ApiFetcherParams<T>) {
    const tokens = getTokens()
    if (tokens === null) {
        return
    }

    const token = refreshToken ? tokens.refresh_token.token : tokens.token.token

    return fetch(`${app.api}${path}`, {
        method,
        body: JSON.stringify(params.body),
        headers: {
            ...defaultHeaders,
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(async res => {
            if (res.status >= 200 && res.status < 300) {
                const data = res.status === 204 ? null : await res.json()
                await params.success(data)
                return
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
            ...defaultHeaders,
        },
    })
        .then(async res => {
            if (res.status >= 200 && res.status < 300) {
                const data = await res.json()
                params.success(data)
                return
            }

            const err = await res.json()
            params.error(err)
        })
        .catch(params.catcher)
}
