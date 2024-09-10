import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Period, PeriodRange, periods, periodsWithSeparators } from "../../types/Period";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { Calendar } from "../ui/calendar";
import { cn } from "../../helpers/utils";
import { DateRange } from "react-day-picker";

export function PeriodChooser({
    activePeriodValue,
    setPeriodAndDate,
    compareWithPrevious,
    setCompareWithPrevious,
}: {
    activePeriodValue: string;
    setPeriodAndDate: (period: Period, range?: PeriodRange) => void;
    compareWithPrevious: boolean;
    setCompareWithPrevious: (compare: boolean) => void;
}) {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() - 7)),
    });

    const setCustomRange = (range: DateRange | undefined = undefined) => {
        const d = range || date;

        if (d === undefined) return;

        if (d.from === undefined || d.to === undefined) return;

        const r = {
            from: new Date(d.from.getTime() + 1000 * 60 * 60 * 24),
            to: new Date(d.to.getTime() + 1000 * 60 * 60 * 24),
        };

        setPeriodAndDate("c_daily", r);
    };

    return (
        <div className="flex flex-col w-full sm:w-auto sm:flex-row flex-grow sm:items-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 min-w-[200px] border soft-border p-2">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <div className="p-2 w-full flex-grow flex flex-row items-center justify-center rounded-sm cursor-pointer hover:bg-zinc-100/90 dark:hover:bg-zinc-700/10">
                        <div className="w-full whitespace-nowrap pr-4">
                            {periods.find((p) => p.value === activePeriodValue)?.label}
                        </div>

                        <ChevronDownIcon />
                    </div>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="min-w-[220px] bg-white dark:bg-zinc-800 rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-50"
                        sideOffset={5}
                        align={"end"}
                    >
                        {periodsWithSeparators.map((p, index) => {
                            if ("period" in p) {
                                return (
                                    <DropdownMenu.Item
                                        key={index}
                                        className="group text-[13px] leading-none rounded-[3px] flex items-center h-[35px] sm:h-[30px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:opacity-30 data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-50 dark:data-[highlighted]:bg-blue-800/20 data-[highlighted]:text-blue-500 dark:data-[highlighted]:text-blue-100"
                                        onSelect={() => setPeriodAndDate(p.period)}
                                    >
                                        {p.value === activePeriodValue && (
                                            <CheckIcon className="text-green-500 h-auto inline-block w-4 absolute left-0.5" />
                                        )}
                                        {p.label}
                                    </DropdownMenu.Item>
                                );
                            } else if ("separator" in p && p.separator) {
                                return (
                                    <DropdownMenu.Separator
                                        key={index}
                                        className="h-[1px] bg-zinc-400/20 dark:bg-zinc-700 m-[5px]"
                                    />
                                );
                            } else if ("type" in p && p.type === "customSelectorToggler") {
                                return (
                                    <DropdownMenu.Item
                                        key={index}
                                        className="group text-[13px] leading-none rounded-[3px] flex items-center h-[35px] sm:h-[30px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:opacity-30 data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-50 dark:data-[highlighted]:bg-blue-800/20 data-[highlighted]:text-blue-500 dark:data-[highlighted]:text-blue-100"
                                        onSelect={(event) => {
                                            event.preventDefault();
                                            setPeriodAndDate("c_daily");
                                            setCustomRange();
                                        }}
                                    >
                                        {"c_daily" === activePeriodValue && (
                                            <CheckIcon className="text-green-500 h-auto inline-block w-4 absolute left-0.5" />
                                        )}
                                        Custom period
                                    </DropdownMenu.Item>
                                );
                            } else if ("type" in p && p.type === "customSelector") {
                                return (
                                    <div
                                        key={index}
                                        className={cn({
                                            "overflow-hidden transition-all duration-200 ease-in-out": true,
                                            "max-h-0": activePeriodValue !== "c_daily",
                                            "max-h-80": activePeriodValue === "c_daily",
                                        })}
                                    >
                                        <DropdownMenu.Separator
                                            key={index}
                                            className="h-[1px] bg-zinc-400/20 dark:bg-zinc-700 m-[5px]"
                                        />
                                        <Calendar
                                            mode="range"
                                            selected={date}
                                            onSelect={(range) => {
                                                setDate(range);
                                                setCustomRange(range);
                                            }}
                                            disabled={{ after: new Date() }}
                                        />
                                    </div>
                                );
                            }

                            return <></>;
                        })}

                        <DropdownMenu.Separator className="h-[1px] bg-zinc-400/20 dark:bg-zinc-700 m-[5px]" />

                        <DropdownMenu.Item
                            className="group text-[13px] leading-none rounded-[3px] flex items-center h-[35px] sm:h-[30px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:opacity-30 data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-50 dark:data-[highlighted]:bg-blue-800/20 data-[highlighted]:text-blue-500 dark:data-[highlighted]:text-blue-100"
                            onSelect={() => setCompareWithPrevious(!compareWithPrevious)}
                        >
                            {compareWithPrevious && (
                                <CheckIcon className="text-green-500 h-auto inline-block w-4 absolute left-0.5" />
                            )}
                            Compare with previous
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    );
}
