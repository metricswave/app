import * as Checkbox from "@radix-ui/react-checkbox"
import {CheckIcon} from "@radix-ui/react-icons"

type Props = {
    name: string
    label: string
    checked: boolean
    onCheckedChanged: (checked: boolean) => void
}

export default function CheckboxInput({name, label, checked, onCheckedChanged: checkedChanged}: Props) {
    return (
            <div className="flex items-center">
                <Checkbox.Root
                        className="smooth flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-sm bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 hover:dark:bg-zinc-700 outline-none"
                        checked={checked}
                        onCheckedChange={checkedChanged}
                        id={name}
                >
                    <Checkbox.Indicator className="text-blue-500 dark:text-blue-300">
                        <CheckIcon className="h-[20px] w-[20px]"/>
                    </Checkbox.Indicator>
                </Checkbox.Root>
                <label className="pl-[15px] leading-none w-full" htmlFor={name}>
                    {label}
                </label>
            </div>
    )
}
