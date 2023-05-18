import React, {PropsWithChildren} from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

const Tooltip = ({children}: PropsWithChildren) => {
    return (
            <TooltipPrimitive.Provider delayDuration={300}>
                <TooltipPrimitive.Root>
                    <TooltipPrimitive.Trigger asChild>
                        <button className="rounded-sm py-1 px-2 text-sm bg-blue-50/60 cursor-help hover:bg-blue-50 smooth">
                            Info
                        </button>
                    </TooltipPrimitive.Trigger>
                    <TooltipPrimitive.Portal>
                        <TooltipPrimitive.Content
                                className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-3 py-3 text-xs shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] max-w-[300px]"
                                sideOffset={5}
                        >
                            {children}
                            <TooltipPrimitive.Arrow className="fill-white"/>
                        </TooltipPrimitive.Content>
                    </TooltipPrimitive.Portal>
                </TooltipPrimitive.Root>
            </TooltipPrimitive.Provider>
    )
}

export default Tooltip
