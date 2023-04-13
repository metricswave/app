import {TriggerType} from "../../types/TriggerType"
import InputFieldBox from "../form/InputFieldBox"
import {FormEvent, useState} from "react"
import * as Dialog from "@radix-ui/react-dialog"
import WeekdayFieldBox from "../form/WeekdayFieldBox"
import TextareaFieldBox from "../form/TextareaFieldBox"
import PrimaryButton from "../form/PrimaryButton"
import {DialogHeader} from "../dialog/DialogHeader"
import EmojiInputFieldBox from "../form/EmojiInputFieldBox"
import {BellEmoji, Emoji} from "../../types/Emoji"
import ParametersFieldBox from "../form/ParametersFieldBox"
import {fetchAuthApi} from "../../helpers/ApiFetcher"
import {generateUuid} from "../../helpers/UuidGenerator"

type Props = {
    triggerType: TriggerType
    back: () => void,
    onTriggerCreated: (uuid: string) => void
}

export const TriggersAddConfigureStep = ({triggerType, back, onTriggerCreated: triggerCreated}: Props) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [emoji, setEmoji] = useState<null | Emoji>(BellEmoji)
    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [values, setValues] = useState<{ [key: string]: string | string[] }>(
            triggerType.configuration.fields.reduce((acc, field) => {
                acc[field.name] = field.multiple ? [] : ""
                return acc
            }, {} as { [key: string]: string | string[] }),
    )

    const handleSubmit = (event: FormEvent) => {
        setLoading(true)
        event.preventDefault()
        event.stopPropagation()

        // todo: validate fields

        const uuid = generateUuid()

        fetchAuthApi("/triggers", {
            method: "POST",
            body: {
                "uuid": uuid,
                "trigger_type_id": triggerType.id,
                "emoji": emoji?.native,
                "title": title,
                "content": content,
                "configuration": {
                    fields: values,
                    version: triggerType.configuration.version,
                },
            },
            success: (response) => {
                triggerCreated(uuid)
                setLoading(false)
            },
            error: (error) => {
                // todo: manage invalid form errors
                setLoading(false)
            },
            catcher: (error) => {
                setLoading(false)
            },
        })
    }

    return (
            <>
                <DialogHeader back={back}/>

                <div className="mt-8 mb-4">
                    <Dialog.Title className="font-bold m-0 text-xl">
                        Configure your notification
                    </Dialog.Title>

                    <Dialog.Description className="mt-2 mb-6 opacity-70">
                        Set a title, a description, and emoji and configure your trigger type.
                    </Dialog.Description>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <div className="flex flex-row space-x-4 justify-center w-full">
                        <EmojiInputFieldBox value={emoji} setValue={setEmoji}/>

                        <InputFieldBox
                                value={title}
                                setValue={setTitle}
                                label="Title"
                                focus={true}
                                name="title"
                                placeholder="Notification Title"
                                required
                                showRequired
                        />
                    </div>

                    <TextareaFieldBox
                            value={content}
                            setValue={setContent}
                            label="Content"
                            name="content"
                            placeholder="Notification Content"
                            required
                            showRequired
                    />

                    {triggerType.configuration.fields.map((field, index) => {
                        if (field.type === "weekdays") {
                            return (
                                    <div key={field.name}>
                                        <WeekdayFieldBox
                                                value={values[field.name]}
                                                setValue={(value) => {
                                                    setValues({...values, [field.name]: value})
                                                }}
                                                label={field.label}
                                                name={field.name}
                                                multiple={field.multiple}
                                                required={field.required}
                                                showRequired
                                        />
                                    </div>
                            )
                        }

                        if (field.type === "parameters") {
                            return (
                                    <div key={field.name}>
                                        <ParametersFieldBox
                                                value={values[field.name] as string}
                                                setValue={(value) => {
                                                    setValues({...values, [field.name]: value})
                                                }}
                                                label={field.label}
                                                name={field.name}
                                                placeholder={field.label}
                                                required={field.required}
                                                showRequired
                                        />
                                    </div>
                            )
                        }

                        return (
                                <div key={field.name}>
                                    <InputFieldBox
                                            value={values[field.name] as string}
                                            type={field.type}
                                            setValue={(value) => {
                                                setValues({...values, [field.name]: value})
                                            }}
                                            label={field.label}
                                            name={field.name}
                                            placeholder={field.label}
                                            required={field.required}
                                            showRequired
                                    />
                                </div>
                        )
                    })}

                    <PrimaryButton loading={loading} text="Create" onClick={handleSubmit}/>
                </form>
            </>
    )
}
