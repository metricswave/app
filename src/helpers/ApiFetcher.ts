import { app, isProduction } from "../config/app";
import { getTokens } from "../storage/AuthToken";

export type ApiResponse<T> = {
    current_page?: number;
    last_page?: number;
    data: T;
};

type ApiErrorResponse = {
    message: string;
    errors?: { [key: string]: string[] };
};

type ApiFetcherParams<T> = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: object;
    refreshToken?: boolean;
    success: (data: ApiResponse<T>, status: number) => void;
    error?: (data: ApiErrorResponse, stats?: number) => void;
    catcher?: (err: Error) => void;
    finally?: (err: Error | ApiErrorResponse) => void;
};

const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
};

export function fetchAuthApi<T>(
    path: string,
    { method = "GET", refreshToken = false, ...params }: ApiFetcherParams<T>,
) {
    const tokens = getTokens();
    if (tokens === null) {
        return;
    }

    const token = refreshToken ? tokens.refresh_token.token : tokens.token.token;

    return fetch(`${app.api}${path}`, {
        method,
        body: JSON.stringify(params.body),
        headers: {
            ...defaultHeaders,
            Authorization: `Bearer ${token}`,
        },
    })
        .then(async (res) => {
            if (res.status >= 200 && res.status < 300) {
                const data = res.status === 204 ? null : await res.json();
                await params.success(data, res.status);
                return;
            }

            const err = await res.json();
            if (params.error !== undefined) params.error(err, res.status);
            if (params.finally !== undefined) params.finally(err);
        })
        .catch((err) => {
            if (params.catcher !== undefined) params.catcher(err);
            if (params.finally !== undefined) params.finally(err);
        });
}

export function fetchApi<T>(path: string, { method = "GET", ...params }: ApiFetcherParams<T>) {
    fetch(`${app.api}${path}`, {
        method,
        body: JSON.stringify(params.body),
        headers: {
            ...defaultHeaders,
        },
    })
        .then(async (res) => {
            if (res.status >= 200 && res.status < 300) {
                const data = res.status === 204 ? null : await res.json();
                await params.success(data, res.status);
                params.success(data, res.status);
                return;
            }

            const err = await res.json();
            if (params.error !== undefined) params.error(err, res.status);
            if (params.finally !== undefined) params.finally(err);
        })
        .catch((err) => {
            if (params.catcher !== undefined) params.catcher(err);
            if (params.finally !== undefined) params.finally(err);
        });
}
