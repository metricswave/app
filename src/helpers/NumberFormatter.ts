import { currentTeamCurrency } from "../storage/Team";

export function number_formatter(n: number, options = {}): string {
    const formatter = new Intl.NumberFormat("en-US", {
        ...{
            maximumFractionDigits: 2,
        },
        ...options,
    });
    return formatter.format(n);
}

export function long_number_formatter(n: number, precision: number = 3, longFormat: boolean = false): string {
    const options = {
        maximumFractionDigits: precision,
    };

    if (n < 10_000 || longFormat) {
        return number_formatter(n, options); // Format number with commas
    }

    // Full format
    if (n < 1_000_000) {
        return number_formatter(n / 1000, options) + "K"; // Format number with commas
    }

    // Anything less than a billion
    if (n < 1_000_000_000) {
        return number_formatter(n / 1000000, options) + "M"; // Format in millions
    }

    // At least a billion
    return number_formatter(n / 1000000000, options) + "B"; // Format in billions
}

export function money_formatter(n: number): string {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currentTeamCurrency() ?? "usd",
        maximumFractionDigits: 2,
    });

    return formatter.format(amount_from_cents(n));
}

export function amount_from_cents(n: number): number {
    return n / 100;
}
