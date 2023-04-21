export type UserService = {
    id: number
    user_id: string
    service_id: number
    service_data: {
        configuration: { [key: string]: string }
    }
    created_at: string
    updated_at: string
}
