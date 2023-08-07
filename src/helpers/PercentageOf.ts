export function percentage_of(totalScore: number, score: number): number {
    return Math.min(100, Math.max(Math.round((score / totalScore) * 100), 1))
}
