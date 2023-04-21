export type Service = OauthService | FormService

type BaseService = {
    id: number
    name: string
    driver: string
    description: string
    scopes: string[]
    multiple: boolean
    created_at: string
    updated_at: string
}

export type OauthService = BaseService & {
    configuration: {
        type: "oauth"
    }
}

export type FormServiceField = {
    name: string
    type: "input"
    label: string
    placeholder: string
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
