export function percentage_of(totalScore: number, score: number): number {
    return Math.min(100, Math.max(Math.round((score / totalScore) * 100), 1))
}

export function percentage_diff(current: number, previous: number): number {
    return previous !== 0 ?
        ((current - previous) / previous * 100) :
        Infinity
}
