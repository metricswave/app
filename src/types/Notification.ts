export type Notification = {
    id: string
    type: string
    notifiable_type: string
    notifiable_id: number
    data: {
        title: string
        content: string
        emoji: string
        trigger_id: number
        trigger_type_id: number
    }
    read_at: string | null
    created_at: string
    updated_at: string
}
