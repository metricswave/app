export function price_formatter(n: number): string {
    const formatter = new Intl.NumberFormat("en-US", {"style": "currency", "currency": "EUR"})
    return formatter.format(n / 100)
}
