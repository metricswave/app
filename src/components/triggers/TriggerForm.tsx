import EmojiInputFieldBox from "../form/EmojiInputFieldBox"
import InputFieldBox from "../form/InputFieldBox"
import TextareaFieldBox from "../form/TextareaFieldBox"
import PrimaryButton from "../form/PrimaryButton"
import {Trigger, TriggerTypeId, TriggerVia} from "../../types/Trigger"
import React, {FormEvent, ReactElement, useState} from "react"
import {BellEmoji, Emoji, emojiFromNative} from "../../types/Emoji"
import WeekdayFieldBox from "../form/WeekdayFieldBox"
import ParametersFieldBox from "../form/ParametersFieldBox"
import {TriggerType, TriggerTypeField} from "../../types/TriggerType"
import CheckboxInputGroup, {CheckboxGroupValue} from "../form/CheckboxInputGroup"
import {useUserServicesState} from "../../storage/UserServices"
import {mergeDefaultWithTriggerViaValues} from "../../helpers/TriggerViaValues"
import LocationFieldBox, {LocationValue} from "../form/LocationFieldBox"
import AddressFieldBox from "../form/AddressFieldBox"
import SelectFieldBox from "../form/SelectFieldBox"

type Props = {
    onSubmit: TriggerFormSubmit,
    trigger?: Trigger,
    triggerType: TriggerType,
}

type FieldValues = { [key: string]: string | string[] | LocationValue }

export type TriggerFormSubmit = (
        params: {
            emoji: Emoji,
            title: string,
            content: string,
            values: FieldValues,
            via: Array<TriggerVia>,
        },
        setErrors: (errors: { [key: string]: string[] }) => void,
) => Promise<void>

function getTriggerInitialState(trigger: Trigger | undefined, triggerType: TriggerType): { [key: string]: string | string[] } {
    return trigger ?
            trigger.configuration.fields :
            triggerType.configuration.fields.reduce((acc, field) => {
                acc[field.name] = field.default ?? (field.multiple ? [] : "")
                return acc
            }, {} as { [key: string]: string | string[] })
}

function triggerInitialStateTitle(triggerType: TriggerType): string {
    switch (triggerType.id) {
        case TriggerTypeId.WeatherSummary:
            return "Today: {weather.today.condition}"
    }

    return ""
}

function triggerIntialStateContent(triggerType: TriggerType): string {
    switch (triggerType.id) {
        case TriggerTypeId.WeatherSummary:
            return "**Temperature:** {weather.today.temperature2m_min}°-{weather.today.temperature2m_max}°\n" +
                    "**Precipitation probability:** {weather.today.precipitation_probability_max}\n" +
                    "**Sunrise:** {weather.today.sunrise} / {weather.today.sunset}"
    }

    return ""
}

export default function TriggerForm(
        {
            onSubmit: submit,
            triggerType,
            trigger,
        }: Props,
) {
    const [loading, setLoading] = useState<boolean>(false)
    const {userServices} = useUserServicesState()

    const [emoji, setEmoji] = useState<Emoji>(trigger ? emojiFromNative(trigger.emoji) : BellEmoji)
    const [title, setTitle] = useState<string>(trigger ? trigger.title : triggerInitialStateTitle(triggerType))
    const [content, setContent] = useState<string>(trigger ? trigger.content : triggerIntialStateContent(triggerType))
    const [values, setValues] = useState<FieldValues>(getTriggerInitialState(trigger, triggerType))
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
    const [viaValues, setViaValues] = useState<Array<TriggerVia>>(
            mergeDefaultWithTriggerViaValues(userServices, trigger),
    )

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        event.stopPropagation()

        setErrors({})
        setLoading(true)

        await submit({emoji, title, content, values, via: viaValues}, setErrors)

        setLoading(false)
    }

    const renderDynamicField = (field: TriggerTypeField): ReactElement => {
        switch (field.type) {
            case "location":
                return (<div key={field.name}>
                    <LocationFieldBox
                            value={values[field.name] as LocationValue}
                            setValue={(value) => {
                                setValues({...values, [field.name]: value})
                            }}
                            label={field.label}
                            name={field.name}
                            required={field.required}
                            showRequired
                    />
                </div>)
            case "weekdays":
                return (<div key={field.name}>
                    <WeekdayFieldBox
                            value={values[field.name] as string[]}
                            setValue={(value) => {
                                setValues({...values, [field.name]: value})
                            }}
                            label={field.label}
                            name={field.name}
                            multiple={field.multiple}
                            required={field.required}
                            showRequired
                    />
                </div>)
            case "select":
                return (<div key={field.name}>
                    <SelectFieldBox
                            options={field.options!}
                            value={values[field.name] as string | string[]}
                            setValue={(value) => {
                                setValues({...values, [field.name]: value})
                            }}
                            label={field.label}
                            name={field.name}
                            multiple={field.multiple}
                            required={field.required}
                            showRequired
                    />
                </div>)
            case "parameters":
                return (<div key={field.name}>
                    <ParametersFieldBox
                            value={values[field.name] as string[]}
                            setValue={(value) => {
                                setValues({...values, [field.name]: value})
                            }}
                            label={field.label}
                            name={field.name}
                            placeholder={field.label}
                            required={field.required}
                            showRequired
                    />
                </div>)
            case "address":
                return (<div key={field.name}>
                    <AddressFieldBox
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
                </div>)
            default:
                return (<div key={field.name}>
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
                </div>)
        }
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
                            error={errors["title"] !== undefined ? errors["title"][0] : false}
                            required
                            showRequired
                    />
                </div>

                <TextareaFieldBox
                        value={content}
                        setValue={setContent}
                        label="Content"
                        name="content"
                        error={errors["content"] !== undefined ? errors["content"][0] : false}
                        placeholder="Notification Content"
                        required
                        showRequired
                />

                <CheckboxInputGroup
                        name="via"
                        label="Notification Channels"
                        values={viaValues as CheckboxGroupValue[]}
                        onCheckedChanged={(values) => {
                            setViaValues(values as Array<TriggerVia>)
                        }}
                        error={viaValues.filter((value) => value.checked).length === 0 ? "This trigger will not be sent to any channel" : false}
                />

                {triggerType.configuration.fields.map(renderDynamicField)}

                {
                        Object.keys(errors).length > 0
                        && errors["configuration"] !== undefined
                        && errors["configuration"].map((error, i) => (
                                <p key={i} className="text-red-500 text-xs mb-4 mx-4">{error}</p>
                        ))
                }

                {
                        Object.keys(errors).length > 0
                        && errors["configuration"] === undefined
                        && (
                                <p className="text-red-500 text-xs mb-4 mx-4">Fix form errors before continuing</p>
                        )
                }

                <PrimaryButton
                        loading={loading}
                        text={trigger === undefined ? "Create" : "Update"}
                        onClick={handleSubmit}
                />

            </form>
    )
}
