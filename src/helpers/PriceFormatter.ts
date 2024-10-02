import { money_formatter } from "./NumberFormatter";

export function price_formatter(n: number): string {
    return money_formatter(n)
}
