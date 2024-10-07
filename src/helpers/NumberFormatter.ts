import { currentTeamCurrency } from "../storage/Team"

export function number_formatter(n: number, options = {}): string {
    const formatter = new Intl.NumberFormat("en-US", {
        ...{
            maximumFractionDigits: 2,
        },
        ...options,
    })
    return formatter.format(n)
}

export function money_formatter(n: number): string {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currentTeamCurrency() ?? "usd",
        maximumFractionDigits: 2,
    })

    return formatter.format(amount_from_cents(n))
}

export function amount_from_cents(n: number): number {
    return n / 100
}
