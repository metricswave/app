export function number_formatter(n: number, options = {}): string {
    const formatter = new Intl.NumberFormat("en-US", {
        ...{
            maximumFractionDigits: 2,
        },
        ...options,
    })
    return formatter.format(n)
}
