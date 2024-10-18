import {fetchAuthApi} from "./ApiFetcher"

export function portalCheckout(teamId: number, redirectTo: string) {
    fetchAuthApi<{ path: string }>(
        `/checkout/${teamId}/portal-path?redirect-to=${redirectTo}`,
        {
            success: (data) => {
                window.location.href = data.data.path
            },
            error: (err: any) => null,
            catcher: (err: any) => null,
        },
    )
}
