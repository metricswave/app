export type Emoji = {
    id: string
    name: string
    native: string
    keywords: string[]
    skins: Skin[]
    version: number
    emoticons?: string[]
}

export const BellEmoji: Emoji = {
    id: "bell",
    name: "Bell",
    native: "🔔",
    keywords: ["sound", "notification", "christmas", "xmas", "chime"],
    skins: [],
    version: 1,
    emoticons: [],
}

interface Skin {
    unified: string
    native: string
    x?: number
    y?: number
}
