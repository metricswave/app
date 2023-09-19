import {DialogHeader} from "../dialog/DialogHeader"
import * as Dialog from "@radix-ui/react-dialog"
import {FormService, FormServiceField} from "../../types/Service"
import InputFieldBox from "../form/InputFieldBox"
import {useState} from "react"
import PrimaryButton from "../form/PrimaryButton"
import {LinkButton} from "../buttons/LinkButton"
import {fetchAuthApi} from "../../helpers/ApiFetcher"
import {app} from "../../config/app"
import {useAuthContext} from "../../contexts/AuthContext";

type Props = {
    channel: FormService,
    onCreated: () => void,
}

export default function ServiceFormConnection({channel, onCreated: created}: Props) {
    const [loading, setLoading] = useState(false)
    const {currentTeamId} = useAuthContext().teamState
    const [values, setValues] = useState<{ [key: string]: string }>(
        channel.configuration.form.fields.reduce((acc, field) => {
            acc[field.name] = ""
            return acc
        }, {} as { [key: string]: string }),
    )
    const [errors, setErrors] = useState<{ [key: string]: string }>(
        channel.configuration.form.fields.reduce((acc, field) => {
            acc[field.name] = ""
            return acc
        }, {} as { [key: string]: string }),
    )

    const isValid = (): boolean => {
        let errors: { [key: string]: string } = {}

        channel.configuration.form.fields.forEach((field) => {
            if (field.required && values[field.name] === "") {
                errors[field.name] = "This field is required"
                return
            }

            if (field.validation !== undefined) {
                if (field.validation.type === "integer" && !Number.isInteger(Number(values[field.name]))) {
                    errors[field.name] = "This field should be a number"
                    return
                }

                if (field.validation.min_length && values[field.name].length < field.validation.min_length) {
                    errors[field.name] = "This field should be at least " + field.validation.min_length + " characters"
                    return
                }

                if (field.validation.max_value !== undefined && Number(values[field.name]) > field.validation.max_value) {
                    errors[field.name] = field.validation.max_value === 0 ?
                        "This field should be negative" :
                        "This field should be at most " + field.validation.max_value
                    return
                }
            }
        })

        setErrors(errors)

        return Object.keys(errors).length === 0
    }

    const handleSubmit = () => {
        if (!isValid()) return

        setLoading(true)

        fetchAuthApi(`/teams/${currentTeamId}/channels`, {
            method: "POST",
            body: {
                channel_id: channel.id,
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
                error={errors[field.name]}
                label={field.label}
                name={field.name}
                placeholder={field.placeholder}
                autoComplete="off"
            />
        )
    }

    return (
        <div>
            <DialogHeader/>

            <div className="mt-8 mb-4">
                <Dialog.Title className="font-bold m-0 text-xl">
                    {channel.configuration.form.title}
                </Dialog.Title>

                <Dialog.Description className="mt-2 mb-6 opacity-70">
                    {channel.configuration.form.description}
                </Dialog.Description>
            </div>

            <div className="flex flex-col space-y-4">
                <div>
                    <LinkButton href={`${app.web}${channel.configuration.form.help.href}`}
                                text={channel.configuration.form.help.title}
                                target="_blank"/>
                </div>

                {channel.configuration.form.fields.map((field, index) => {
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
