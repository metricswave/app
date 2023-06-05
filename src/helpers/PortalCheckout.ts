import {fetchAuthApi} from "./ApiFetcher"

export function portalCheckout(redirectTo: string) {
    fetchAuthApi<{ url: string }>(
        `/checkout/portal-path?redirect-to=${redirectTo}`,
        {
            success: (data) => {
                window.location.href = data.data.url
            },
            error: (err: any) => null,
            catcher: (err: any) => null,
        },
    )
}
