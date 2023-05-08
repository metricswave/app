import React from "react"
import * as RadioGroup from "@radix-ui/react-radio-group"

type Props = {
    name: string
    value: string
    values: Array<{ label: string, value: string }>
    onChange: (value: string) => void
}

export default function RadioGroupComponent({name, value, values, onChange: changed}: Props) {
    return (
            <RadioGroup.Root
                    className="flex flex-col gap-2.5"
                    defaultValue="default"
                    aria-label="View density"
                    onValueChange={changed}
            >

                {values.map(({label, value: optionValue}) =>
                        <div className="flex items-center" key={`${label}_${optionValue}`}>
                            <RadioGroup.Item
                                    className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 hover:dark:bg-zinc-700 w-[25px] h-[25px] rounded-full outline-none cursor-default"
                                    value={optionValue}
                                    checked={optionValue === value}
                                    id={`${name}_${optionValue}`}
                            >
                                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-zinc-600 after:dark:bg-zinc-200"/>
                            </RadioGroup.Item>

                            <label
                                    className="w-full leading-none pl-[15px]"
                                    htmlFor={`${name}_${optionValue}`}
                            >
                                {label}
                            </label>
                        </div>,
                )}

            </RadioGroup.Root>
    )
}
