export type Emoji = {
    id: string
    name: string
    native: string
    keywords: string[]
    skins: Skin[]
    version: number
    emoticons?: string[]
}

export const VisitsEmoji: Emoji = {
    id: "bar_chart",
    name: "Bar Chart",
    native: "📊",
    keywords: ["graph", "presentation", "stats"],
    skins: [],
    version: 1,
}

export const FunnelEmoji: Emoji = {
    id: "mega",
    name: "Megaphone",
    native: "📣",
    keywords: ["mega", "sound", "speaker", "volume"],
    skins: [],
    version: 1,
}

export const BellEmoji: Emoji = {
    id: "bell",
    name: "Bell",
    native: "🔔",
    keywords: ["sound", "notification", "christmas", "xmas", "chime"],
    skins: [],
    version: 1,
}

export const emojiFromNative = (native: string): Emoji => {
    const emoji = BellEmoji
    emoji.native = native
    return emoji
}

interface Skin {
    unified: string
    native: string
    x?: number
    y?: number
}
