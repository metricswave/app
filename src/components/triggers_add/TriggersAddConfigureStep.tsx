import {TriggerType} from "../../types/TriggerType"
import InputFieldBox from "../form/InputFieldBox"
import {useState} from "react"
import * as Dialog from "@radix-ui/react-dialog"
import WeekdayFieldBox from "../form/WeekdayFieldBox"
import TextareaFieldBox from "../form/TextareaFieldBox"
import PrimaryButton from "../form/PrimaryButton"
import {DialogHeader} from "../dialog/DialogHeader"
import EmojiInputFieldBox from "../form/EmojiInputFieldBox"
import {Emoji} from "../../types/Emoji"
import ParametersFieldBox from "../form/ParametersFieldBox"

type Props = {
    triggerType: TriggerType
    back: () => void
}

export const TriggersAddConfigureStep = ({triggerType, back}: Props) => {
    const [emoji, setEmoji] = useState<null | Emoji>({id: "bell", native: "🔔"})
    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [values, setValues] = useState<{ [key: string]: string }>(
            triggerType.configuration.fields.reduce((acc, field) => {
                acc[field.name] = ""
                return acc
            }, {} as { [key: string]: string }),
    )

    console.log({emoji})

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

                <div className="flex flex-col space-y-4">
                    <div className="flex flex-row space-x-4 justify-center w-full">
                        <EmojiInputFieldBox value={emoji} setValue={setEmoji} name="emoji" placeholder="🔔"/>

                        <InputFieldBox
                                value={title}
                                setValue={setTitle}
                                label="Title"
                                focus={true}
                                name="title"
                                placeholder="Notification Title"
                                required
                        />
                    </div>

                    <TextareaFieldBox
                            value={content}
                            setValue={setContent}
                            label="Content"
                            name="content"
                            placeholder="Notification Content"
                            required
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
                                        />
                                    </div>
                            )
                        }

                        if (field.type === "parameters") {
                            return (
                                    <div key={field.name}>
                                        <ParametersFieldBox
                                                value={values[field.name]}
                                                setValue={(value) => {
                                                    setValues({...values, [field.name]: value})
                                                }}
                                                label={field.label}
                                                name={field.name}
                                                placeholder={field.label}
                                                required={field.required}
                                        />
                                    </div>
                            )
                        }

                        return (
                                <div key={field.name}>
                                    <InputFieldBox
                                            value={values[field.name]}
                                            type={field.type}
                                            setValue={(value) => {
                                                setValues({...values, [field.name]: value})
                                            }}
                                            label={field.label}
                                            name={field.name}
                                            placeholder={field.label}
                                            required={field.required}
                                    />
                                </div>
                        )
                    })}

                    <PrimaryButton text="Create"/>
                </div>
            </>
    )
}
