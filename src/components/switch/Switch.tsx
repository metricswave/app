import React from "react"
import * as RadixSwitch from "@radix-ui/react-switch"

type Props = {
    value: boolean,
    onChange: (value: boolean) => void,
}

const Switch = ({value, onChange: changed}: Props) => (
    <form>
        <div className="flex items-center" style={{display: "flex", alignItems: "center"}}>
            <RadixSwitch.Root
                checked={value}
                onCheckedChange={changed}
                className="w-[42px] h-[25px] bg-black/10 dark:bg-black rounded-full relative focus:shadow-[0_0_0_2px] focus:shadow-black dark:focus:shadow-blue-300 data-[state=checked]:bg-black dark:data-[state=checked]:bg-blue-500 outline-none cursor-default"
                id="airplane-mode"
            >
                <RadixSwitch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-black/25 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]"/>
            </RadixSwitch.Root>
        </div>
    </form>
)

export default Switch
