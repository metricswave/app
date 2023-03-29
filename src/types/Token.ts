export type Token = {
    token: string
    expires_at: number
}

export type Tokens = {
    token: Token,
    refresh_token: Token,
}
