import EmojiInputFieldBox from "../form/EmojiInputFieldBox";
import InputFieldBox from "../form/InputFieldBox";
import PrimaryButton from "../form/PrimaryButton";
import { Trigger, TriggerVia } from "../../types/Trigger";
import React, { FormEvent, ReactElement, useEffect, useState } from "react";
import { BellEmoji, Emoji, emojiFromNative, MoneyIncomeEmoji, FunnelEmoji, VisitsEmoji } from "../../types/Emoji";
import ParametersFieldBox from "../form/ParametersFieldBox";
import { TriggerType, TriggerTypeField, WebhookTriggerType } from "../../types/TriggerType";
import CheckboxInputGroup, { CheckboxGroupValue } from "../form/CheckboxInputGroup";
import { mergeDefaultWithTriggerViaValues } from "../../helpers/TriggerViaValues";
import { LocationValue } from "../form/LocationFieldBox";
import AutocompleteTextareaFieldBox from "../form/AutocompleteTextareaFieldBox";
import InputLabel from "../form/InputLabel";
import { LinkButton } from "../buttons/LinkButton";
import TextareaFieldBox from "../form/TextareaFieldBox";
import { useTeamChannelsState } from "../../storage/TeamChannels";

type Props = {
    onSubmit: TriggerFormSubmit;
    trigger?: Trigger;
    triggerType: TriggerType;
    webhookTriggerType?: WebhookTriggerType | undefined;
    autoCreate?: boolean;
};

type FieldValues = { [key: string]: string | string[] | LocationValue };

export type TriggerFormSubmit = (
    params: {
        emoji: Emoji;
        title: string;
        content: string;
        values: FieldValues;
        via: Array<TriggerVia>;
        type: WebhookTriggerType;
        steps: string[];
    },
    setErrors: (errors: { [key: string]: string[] }) => void,
) => Promise<void>;

function getTriggerInitialState(
    trigger: Trigger | undefined,
    fields: TriggerTypeField[],
    webhookType: WebhookTriggerType,
): {
    [key: string]: string | string[];
} {
    return trigger
        ? trigger.configuration.fields
        : fields.reduce(
              (acc, field) => {
                  if (field.name === "parameters" && webhookType === "visits") {
                      acc[field.name] = [
                          "path",
                          "domain",
                          "language",
                          "userAgent",
                          "platform",
                          "referrer",
                          "utm_source",
                          "utm_medium",
                          "utm_campaign",
                          "utm_term",
                          "utm_content",
                      ];
                  } else if (field.name === "parameters" && webhookType === "funnel") {
                      acc[field.name] = ["step", "user_id"];
                  } else if (field.name === "parameters" && webhookType === "money_income") {
                      acc[field.name] = ["amount", "source"];
                  } else {
                      acc[field.name] = field.default ?? (field.multiple ? [] : "");
                  }

                  return acc;
              },
              {} as { [key: string]: string | string[] },
          );
}

function triggerInitialStateTitle(type: WebhookTriggerType): string {
    switch (type) {
        case "money_income":
            return "New Income";
        case "visits":
            return "New Visit";
        case "funnel":
            return "Funnel";
    }

    return "Custom event";
}

function triggerInitialStateEmoji(type: WebhookTriggerType): Emoji {
    switch (type) {
        case "money_income":
            return MoneyIncomeEmoji;
        case "visits":
            return VisitsEmoji;
        case "funnel":
            return FunnelEmoji;
    }

    return BellEmoji;
}

function triggerInitialStateContent(type: WebhookTriggerType): string {
    switch (type) {
        case "visits":
            return "Visit to: {path}";
        case "funnel":
            return "Step: {step}";
        case "money_income":
            return "Income: {amount} {currency}";
    }

    return "";
}

function autocompleteOptionsForTriggerType(values: FieldValues): string[] {
    if (values["parameters"] === undefined) {
        return [];
    }

    return (values["parameters"] as string[]) ?? [];
}

export default function TriggerForm({
    onSubmit: submit,
    triggerType,
    trigger,
    webhookTriggerType,
    autoCreate = false,
}: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const { teamChannels } = useTeamChannelsState();
    const [minimalFormFields] = useState<boolean>(
        webhookTriggerType !== "custom" && webhookTriggerType !== "money_income",
    );

    const [emoji, setEmoji] = useState<Emoji>(
        trigger ? emojiFromNative(trigger.emoji) : triggerInitialStateEmoji(webhookTriggerType ?? "custom"),
    );
    const [title, setTitle] = useState<string>(
        trigger ? trigger.title : triggerInitialStateTitle(webhookTriggerType ?? "custom"),
    );
    const [content, setContent] = useState<string>(
        trigger ? trigger.content : triggerInitialStateContent(webhookTriggerType ?? "custom"),
    );
    const [fields] = useState<TriggerTypeField[]>(triggerType?.configuration?.fields ?? []);
    const [values, setValues] = useState<FieldValues>(
        getTriggerInitialState(trigger, fields, webhookTriggerType ?? "custom"),
    );
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [viaValues, setViaValues] = useState<Array<TriggerVia>>(
        mergeDefaultWithTriggerViaValues(teamChannels, trigger),
    );

    const [steps, setSteps] = useState<string>(
        trigger && trigger.configuration.steps ? trigger.configuration.steps.join("\n") : "",
    );

    const handleSubmit = async (event?: FormEvent) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        setErrors({});
        setLoading(true);

        const stepsArray = steps.split("\n").filter((step) => step !== "");
        await submit(
            {
                emoji,
                title,
                content,
                values,
                via: viaValues,
                type: webhookTriggerType ?? "custom",
                steps: stepsArray,
            },
            setErrors,
        );

        setLoading(false);
    };

    const renderDynamicField = (field: TriggerTypeField): ReactElement => {
        switch (field.type) {
            case "parameters":
                return (
                    <div key={field.name}>
                        <ParametersFieldBox
                            visible={!minimalFormFields}
                            value={values[field.name] as string[]}
                            setValue={(value) => {
                                setValues({ ...values, [field.name]: value });
                            }}
                            label={field.label}
                            name={field.name}
                            placeholder={field.label}
                            required={field.required}
                            showRequired
                        />
                    </div>
                );
            default:
                return (
                    <div key={field.name}>
                        <InputFieldBox
                            value={values[field.name] as string}
                            type={field.type}
                            setValue={(value) => {
                                setValues({ ...values, [field.name]: value });
                            }}
                            label={field.label}
                            name={field.name}
                            placeholder={field.label}
                            required={field.required}
                            showRequired
                        />
                    </div>
                );
        }
    };

    useEffect(() => {
        autoCreate && handleSubmit();
    }, [autoCreate]);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-row space-x-4 justify-center w-full">
                <EmojiInputFieldBox value={emoji} setValue={setEmoji} />

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
                autocompleteOptions={autocompleteOptionsForTriggerType(values)}
                error={errors["content"] !== undefined ? errors["content"][0] : false}
                placeholder="Notification Content"
                required
                showRequired
                visible={!minimalFormFields}
            />

            {!minimalFormFields && (
                <>
                    {viaValues.length === 0 ? (
                        <>
                            <div className="flex flex-col border transition-all border-zinc-200/60 hover:border-zinc-200 focus-within:hover:border-zinc-300 focus-within:border-zinc-300 duration-300 dark:border-zinc-700/60 rounded-sm hover:dark:border-zinc-700 group focus-within:dark:border-zinc-600 hover:focus-within:dark:border-zinc-600">
                                <InputLabel
                                    name={"via"}
                                    label={"Notification Channels"}
                                    required={false}
                                    showRequired={false}
                                />

                                <div className="pt-3 px-4 text-sm opacity-80 pb-4">
                                    To share this event on a channel you need to create it before. You can do it in the{" "}
                                    <LinkButton text="channels page" href="/settings/channels" />.
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <CheckboxInputGroup
                                name="via"
                                label="Notification Channels"
                                values={viaValues.map((v) => {
                                    return { value: v.id.toString(), ...v } as CheckboxGroupValue;
                                })}
                                onCheckedChanged={(values) => {
                                    const viaValues = (values as Array<CheckboxGroupValue & { type: string }>).map(
                                        (v) => {
                                            return {
                                                id: parseInt(v.value),
                                                label: v.label,
                                                checked: v.checked,
                                                type: v.type as string,
                                            } as TriggerVia;
                                        },
                                    );

                                    setViaValues(viaValues);
                                }}
                            />
                        </>
                    )}
                </>
            )}

            {webhookTriggerType !== "money_income" && fields.map(renderDynamicField)}

            {webhookTriggerType === "funnel" && (
                <div key="steps">
                    <TextareaFieldBox
                        value={steps}
                        setValue={(value) => {
                            setSteps(value);
                        }}
                        label="Steps"
                        name="steps"
                        placeholder={"Step 1\nStep 2\nStep 3"}
                        required={true}
                        description={"One step per line, and in order."}
                        height="h-[100px]"
                        showRequired
                    />
                </div>
            )}

            {Object.keys(errors).length > 0 &&
                errors["configuration"] !== undefined &&
                errors["configuration"].map((error, i) => (
                    <p key={i} className="text-red-500 text-xs mb-4 mx-4">
                        {error}
                    </p>
                ))}

            {Object.keys(errors).length > 0 && errors["configuration"] === undefined && (
                <p className="text-red-500 text-xs mb-4 mx-4">Fix form errors before continuing</p>
            )}

            <PrimaryButton
                loading={loading}
                text={trigger === undefined ? "Create" : "Update"}
                onClick={handleSubmit}
            />
        </form>
    );
}
