import {DialogHeader} from "../dialog/DialogHeader"
import * as Dialog from "@radix-ui/react-dialog"
import {FormService, FormServiceField} from "../../types/Service"
import InputFieldBox from "../form/InputFieldBox"
import {useState} from "react"
import PrimaryButton from "../form/PrimaryButton"
import {LinkButton} from "../buttons/LinkButton"
import {fetchAuthApi} from "../../helpers/ApiFetcher"
import {app} from "../../config/app"

type Props = {
    service: FormService,
    onCreated: () => void,
}

export default function ServiceFormConnection({service, onCreated: created}: Props) {
    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState<{ [key: string]: string }>(
            service.configuration.form.fields.reduce((acc, field) => {
                acc[field.name] = ""
                return acc
            }, {} as { [key: string]: string }),
    )

    const handleSubmit = () => {
        // todo: validate inputs

        setLoading(true)

        fetchAuthApi("/users/services", {
            method: "POST",
            body: {
                service_id: service.id,
                fields: values,
            },
            success: () => {
                setLoading(false)
                created()
            },
            error: () => setLoading(false),
            catcher: () => setLoading(false),
        })
    }

    const renderDynamicField = (field: FormServiceField, index: number = 0) => {
        return (
                <InputFieldBox
                        key={index}
                        focus={index === 0}
                        value={values[field.name]}
                        setValue={(value) => {
                            setValues({...values, [field.name]: value})
                        }}
                        label={field.label}
                        name={field.name}
                        placeholder={field.placeholder}
                />
        )
    }

    return (
            <div>
                <DialogHeader/>

                <div className="mt-8 mb-4">
                    <Dialog.Title className="font-bold m-0 text-xl">
                        {service.configuration.form.title}
                    </Dialog.Title>

                    <Dialog.Description className="mt-2 mb-6 opacity-70">
                        {service.configuration.form.description}
                    </Dialog.Description>
                </div>

                <div className="flex flex-col space-y-4">
                    <div>
                        <LinkButton href={`${app.web}${service.configuration.form.help.href}`}
                                    text={service.configuration.form.help.title}
                                    target="_blank"/>
                    </div>

                    {service.configuration.form.fields.map((field, index) => {
                        return renderDynamicField(field, index)
                    })}

                    <PrimaryButton
                            loading={loading}
                            text="Create Service"
                            onClick={handleSubmit}
                    />
                </div>

            </div>
    )
}
