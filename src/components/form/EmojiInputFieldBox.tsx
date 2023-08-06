import React from "react"
import data from "@emoji-mart/data"
import EmojiPicker from "@emoji-mart/react"
import {Emoji} from "../../types/Emoji"

type Props = {
    value: Emoji | null,
    setValue: (value: Emoji) => void,
}

export default function EmojiInputFieldBox({value, setValue}: Props) {
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

            </div>
        </>
    )
}
