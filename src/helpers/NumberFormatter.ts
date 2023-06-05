export function number_formatter(n: number): string {
    const formatter = new Intl.NumberFormat("en-US", {})
    return formatter.format(n)
}
