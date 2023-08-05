import EmojiInputFieldBox from "../form/EmojiInputFieldBox"
import InputFieldBox from "../form/InputFieldBox"
import PrimaryButton from "../form/PrimaryButton"
import {Trigger, TriggerTypeId, TriggerVia} from "../../types/Trigger"
import React, {FormEvent, ReactElement, useState} from "react"
import {BellEmoji, Emoji, emojiFromNative} from "../../types/Emoji"
import ParametersFieldBox from "../form/ParametersFieldBox"
import {TriggerType, TriggerTypeField, WebhookTriggerType} from "../../types/TriggerType"
import CheckboxInputGroup, {CheckboxGroupValue} from "../form/CheckboxInputGroup"
import {useUserServicesState} from "../../storage/UserServices"
import {mergeDefaultWithTriggerViaValues} from "../../helpers/TriggerViaValues"
import {LocationValue} from "../form/LocationFieldBox"
import AutocompleteTextareaFieldBox from "../form/AutocompleteTextareaFieldBox"
import InputLabel from "../form/InputLabel"
import {LinkButton} from "../buttons/LinkButton"

type Props = {
    onSubmit: TriggerFormSubmit,
    trigger?: Trigger,
    triggerType: TriggerType,
    webhookTriggerType?: WebhookTriggerType | undefined,
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

function getTriggerInitialState(trigger: Trigger | undefined, triggerType: TriggerType): {
    [key: string]: string | string[]
} {
    // todo: add default values to parameters field name

    return trigger ?
        trigger.configuration.fields :
        triggerType.configuration.fields.reduce((acc, field) => {
            acc[field.name] = field.default ?? (field.multiple ? [] : "")
            return acc
        }, {} as { [key: string]: string | string[] })
}

function triggerInitialStateTitle(type: WebhookTriggerType): string {
    switch (type) {
        case "visits":
            return "New Visit"
        case "funnel":
            return "Funnel"
    }

    return "Custom event"
}

function triggerInitialStateContent(type: WebhookTriggerType): string {
    switch (type) {
        case "visits":
            return "Visit to: {path}"
        case "funnel":
            return "Step: {step}"
    }

    return ""
}

function autocompleteOptionsForTriggerType(triggerType: TriggerType, values: FieldValues): string[] {
    switch (triggerType.id) {
        case TriggerTypeId.CalendarTimeToLeave:
            return [
                "origin",
                "destination",
                "travel_mode",
                "arrival_time",
                "distance",
                "meters",
                "duration",
                "seconds",
                "event.title",
                "event.date",
                "event.time",
            ]
        case TriggerTypeId.WeatherSummary:
            return [
                "weather.today.code",
                "weather.today.condition",
                "weather.today.temperature2m_max",
                "weather.today.temperature2m_min",
                "weather.today.apparent_temperature_max",
                "weather.today.apparent_temperature_min",
                "weather.today.sunrise",
                "weather.today.sunset",
                "weather.today.uv_index_max",
                "weather.today.uv_index_clear_sky_max",
                "weather.today.precipitation_sum",
                "weather.today.rain_sum",
                "weather.today.showers_sum",
                "weather.today.snowfall_sum",
                "weather.today.precipitation_hours",
                "weather.today.precipitation_probability_max",
                "weather.today.wind_speed10m_max",
                "weather.today.wind_gusts10m_max",
                "weather.today.wind_direction10m_dominant",
                "weather.today.shortwave_radiation_sum",
                "weather.today.et0_fao_evapotranspiration",
                "weather.tomorrow.code",
                "weather.tomorrow.condition",
                "weather.tomorrow.temperature2m_max",
                "weather.tomorrow.temperature2m_min",
                "weather.tomorrow.apparent_temperature_max",
                "weather.tomorrow.apparent_temperature_min",
                "weather.tomorrow.sunrise",
                "weather.tomorrow.sunset",
                "weather.tomorrow.uv_index_max",
                "weather.tomorrow.uv_index_clear_sky_max",
                "weather.tomorrow.precipitation_sum",
                "weather.tomorrow.rain_sum",
                "weather.tomorrow.showers_sum",
                "weather.tomorrow.snowfall_sum",
                "weather.tomorrow.precipitation_hours",
                "weather.tomorrow.precipitation_probability_max",
                "weather.tomorrow.wind_speed10m_max",
                "weather.tomorrow.wind_gusts10m_max",
                "weather.tomorrow.wind_direction10m_dominant",
                "weather.tomorrow.shortwave_radiation_sum",
                "weather.tomorrow.et0_fao_evapotranspiration",
            ]
        case TriggerTypeId.TimeToLeave:
            return [
                "origin",
                "destination",
                "travel_mode",
                "arrival_time",
                "distance",
                "meters",
                "duration",
                "seconds",
            ]
        case TriggerTypeId.Webhook:
            return values["parameters"] as string[] ?? []
    }

    return []
}

export default function TriggerForm(
    {
        onSubmit: submit,
        triggerType,
        trigger,
        webhookTriggerType,
    }: Props,
) {
    const [loading, setLoading] = useState<boolean>(false)
    const {userServices} = useUserServicesState()

    const [emoji, setEmoji] = useState<Emoji>(trigger ? emojiFromNative(trigger.emoji) : BellEmoji)
    const [title, setTitle] = useState<string>(trigger ?
        trigger.title :
        triggerInitialStateTitle(webhookTriggerType ?? "custom"),
    )
    const [content, setContent] = useState<string>(trigger ?
        trigger.content :
        triggerInitialStateContent(webhookTriggerType ?? "custom"),
    )
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

            <AutocompleteTextareaFieldBox
                value={content}
                setValue={setContent}
                label="Content"
                name="content"
                autocompleteOptions={autocompleteOptionsForTriggerType(triggerType, values)}
                error={errors["content"] !== undefined ? errors["content"][0] : false}
                placeholder="Notification Content"
                required
                showRequired
            />

            {viaValues.length === 0 ? (<>
                <div className="flex flex-col border transition-all border-zinc-200/60 hover:border-zinc-200 focus-within:hover:border-zinc-300 focus-within:border-zinc-300 duration-300 dark:border-zinc-700/60 rounded-sm hover:dark:border-zinc-700 group focus-within:dark:border-zinc-600 hover:focus-within:dark:border-zinc-600">

                    <InputLabel name={"via"} label={"Notification Channels"} required={false} showRequired={false}/>

                    <div className="pt-3 px-4 text-sm opacity-80 pb-4">
                        To share this event on a channel you need to create it before. You can do it in the <LinkButton
                        text="channels page"
                        href="/services"/>.
                    </div>
                </div>
            </>) : (<>
                <CheckboxInputGroup
                    name="via"
                    label="Notification Channels"
                    values={viaValues.map(v => {
                        return {value: v.id.toString(), ...v} as CheckboxGroupValue
                    })}
                    onCheckedChanged={(values) => {
                        const viaValues = (values as Array<CheckboxGroupValue & { type: string }>)
                            .map((v) => {
                                return {
                                    id: parseInt(v.value), label: v.label, checked: v.checked, type: v.type as string,
                                } as TriggerVia
                            })

                        setViaValues(viaValues)
                    }}
                    error={viaValues.filter((value) => value.checked).length === 0 ? "This trigger will not be sent to any channel" : false}
                />
            </>)}

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
