import {twMerge as twMergeOriginal} from "tailwind-merge"
import clsx from "clsx"

export function twMerge(...args: any[]) {
    return twMergeOriginal(clsx(args))
}
