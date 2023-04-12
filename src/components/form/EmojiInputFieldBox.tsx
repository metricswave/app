import React from "react"
import data from "@emoji-mart/data"
import EmojiPicker from "@emoji-mart/react"
import {Emoji} from "../../types/Emoji"

type Props = {
    value: Emoji | null,
    disabled?: boolean,
    setValue: (value: Emoji) => void,
    error?: false | string,
    focus?: boolean,
    required?: boolean,
    name: string,
    type?: string,
    placeholder: string
}

export default function EmojiInputFieldBox(
        {
            value,
            setValue,
            error,
            name,
            type = "text",
            disabled = false,
            focus = false,
            required = false,
            placeholder,
        }: Props,
) {
    const [emojiPickerVisible, setEmojiPickerVisible] = React.useState(false)

    return (
            <>
                <div className="flex flex-col border transition-all border-zinc-200/60 hover:border-zinc-200 focus-within:hover:border-zinc-300 focus-within:border-zinc-300 duration-300 dark:border-zinc-700/60 rounded-sm hover:dark:border-zinc-700 group focus-within:dark:border-zinc-600 hover:focus-within:dark:border-zinc-600 items-center justify-center p-4 w-[82px] text-center aspect-square relative left">

                    <div onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
                         className="cursor-pointer text-3xl">
                        {value?.native}
                    </div>

                    <div className={[
                        emojiPickerVisible ? "" : "hidden",
                        "absolute top-full mt-4 left-0 shadow-xl rounded-sm z-10",
                    ].join(" ")}>
                        <EmojiPicker data={data}
                                     onClickOutside={() => {
                                         if (emojiPickerVisible) setEmojiPickerVisible(false)
                                     }}
                                     onEmojiSelect={(v: Emoji) => {
                                         setValue(v)
                                         setEmojiPickerVisible(false)
                                     }}/>
                    </div>

                    {error && <p className="text-red-500 text-xs mb-4 mx-4">{error}</p>}

                </div>
            </>
    )
}
