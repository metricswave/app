export type TriggerType = {
    id: number
    name: string
    description: string
    icon: string
    configuration: {
        fields: Array<{
            label: string
            name: string
            required: boolean
            multiple: boolean
            type: string
        }>
        version: string
    }
}
