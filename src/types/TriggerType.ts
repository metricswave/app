export type TriggerType = {
    id: number
    name: string
    description: string
    icon: string
    configuration: {
        fields: Array<TriggerTypeField>
        version: string
    }
}

export type TriggerTypeField = {
    label: string
    name: string
    required: boolean
    multiple: boolean
    type: string
    default?: string
    options?: { label: string, value: string }[]
}
