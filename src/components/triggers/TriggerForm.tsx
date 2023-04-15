import EmojiInputFieldBox from "../form/EmojiInputFieldBox"
import InputFieldBox from "../form/InputFieldBox"
import TextareaFieldBox from "../form/TextareaFieldBox"
import PrimaryButton from "../form/PrimaryButton"
import {Trigger} from "../../types/Trigger"
import {FormEvent, useState} from "react"
import {BellEmoji, Emoji} from "../../types/Emoji"
import WeekdayFieldBox from "../form/WeekdayFieldBox"
import ParametersFieldBox from "../form/ParametersFieldBox"
import {TriggerType} from "../../types/TriggerType"

type Props = {
    onSubmit: TriggerFormSubmit,
    trigger?: Trigger,
    triggerType: TriggerType,
}

export type TriggerFormSubmit = (params: {
    emoji: Emoji,
    title: string,
    content: string,
    values: { [key: string]: string | string[] }
}) => Promise<void>

export default function TriggerForm(
        {
            onSubmit: submit,
            triggerType,
            trigger,
        }: Props,
) {
    const [loading, setLoading] = useState<boolean>(false)
    const [emoji, setEmoji] = useState<Emoji>(BellEmoji)
    const [title, setTitle] = useState<string>(trigger ? trigger.title : "")
    const [content, setContent] = useState<string>(trigger ? trigger.content : "")
    const [values, setValues] = useState<{ [key: string]: string | string[] }>(
            trigger ?
                    trigger.configuration.fields :
                    triggerType.configuration.fields.reduce((acc, field) => {
                        acc[field.name] = field.multiple ? [] : ""
                        return acc
                    }, {} as { [key: string]: string | string[] }),
    )

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        event.stopPropagation()

        setLoading(true)
        await submit({emoji, title, content, values})
        setLoading(false)
    }

    return (
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

                {triggerType.configuration.fields.map((field) => {
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

                <PrimaryButton
                        loading={loading}
                        text={trigger === undefined ? "Create" : "Update"}
                        onClick={handleSubmit}
                />
            </form>
    )
}
