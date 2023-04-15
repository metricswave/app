export type Trigger = {
    id: string
    uuid: string
    emoji: string
    title: string
    content: string
    trigger_type_id: number
    configuration: {
        fields: { [key: string]: string | string[] }
    }
}
