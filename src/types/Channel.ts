export type Channel = FormService

type BaseService = {
    id: number
    name: string
    driver: string
    description: string
    created_at: string
    updated_at: string
}

export type FormServiceField = {
    name: string
    type: "input"
    label: string
    placeholder: string
    required?: boolean
    validation?: {
        max_value?: number
        min_length?: number
        type?: "integer"
    }
}

export type FormService = BaseService & {
    configuration: {
        type: "form"
        form: {
            title: string
            description: string
            help: {
                title: string
                href: string
            },
            fields: FormServiceField[]
        }
    }
}
