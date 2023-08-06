import {WebhookTriggerType} from "../types/TriggerType"
import React from "react"

export function triggerWebhookReadableType(triggerType: WebhookTriggerType): string {
    switch (triggerType) {
        case "visits":
            return "Visits"
        case "funnel":
            return "Funnel"
        default:
            return "Custom"
    }
}

export function webhookTriggerTypeIcon(triggerType: WebhookTriggerType) {
    if (triggerType === "funnel") {
        return (<svg className="w-4 h-auto dark:text-orange-500"
                     viewBox="0 0 24 24"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                     stroke="currentColor">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path d="M2 12L5 12M22 12L19 12M14 12L10 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"></path>
                <path d="M5 13L5 7.5C5 6.56538 5 6.09808 5.20096 5.75C5.33261 5.52197 5.52197 5.33261 5.75 5.20096C6.09808 5 6.56538 5 7.5 5C8.43462 5 8.90192 5 9.25 5.20096C9.47803 5.33261 9.66739 5.52197 9.79904 5.75C10 6.09808 10 6.56538 10 7.5L10 16.5C10 17.4346 10 17.9019 9.79904 18.25C9.66739 18.478 9.47803 18.6674 9.25 18.799C8.90192 19 8.43462 19 7.5 19C6.56538 19 6.09808 19 5.75 18.799C5.52197 18.6674 5.33261 18.478 5.20096 18.25C5.03954 17.9704 5.00778 17.6139 5.00153 17"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"></path>
                <path d="M16.5 7C15.5654 7 15.0981 7 14.75 7.20096C14.522 7.33261 14.3326 7.52197 14.201 7.75C14 8.09808 14 8.56538 14 9.5L14 14.5C14 15.4346 14 15.9019 14.201 16.25C14.3326 16.478 14.522 16.6674 14.75 16.799C15.0981 17 15.5654 17 16.5 17C17.4346 17 17.9019 17 18.25 16.799C18.478 16.6674 18.6674 16.478 18.799 16.25C19 15.9019 19 15.4346 19 14.5V9.5C19 8.56538 19 8.09808 18.799 7.75C18.6674 7.52197 18.478 7.33261 18.25 7.20096C17.9019 7 17.4346 7 16.5 7Z"
                      stroke="currentColor"
                      strokeWidth="1.5"></path>
            </g>
        </svg>)
    } else if (triggerType === "visits") {
        return (<svg className="w-4 h-auto dark:text-orange-500"
                     viewBox="0 0 24 24"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracurrentColorerCarrier"
               stroke-linecurrentcolorurrentcurrentcolorap="round"
               strokeLinejoin="round"></g>
            <g id="SVGRepo_icurrentColoronCarrier">
                <path d="M22 22H2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      stroke-linecurrentcolorurrentcurrentcolorap="round"></path>
                <path d="M21 22V14.5C21 13.6716 20.3284 13 19.5 13H16.5C15.6716 13 15 13.6716 15 14.5V22"
                      stroke="currentColor"
                      strokeWidth="1.5"></path>
                <path d="M15 22V9M9 22V5C9 3.58579 9 2.87868 9.43934 2.43934C9.87868 2 10.5858 2 12 2C13.4142 2 14.1213 2 14.5607 2.43934C15 2.87868 15 3.58579 15 5V5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      stroke-linecurrentcolorurrentcurrentcolorap="round"
                      strokeLinejoin="round"></path>
                <path d="M9 22V9.5C9 8.67157 8.32843 8 7.5 8H4.5C3.67157 8 3 8.67157 3 9.5V16M3 22V19.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      stroke-linecurrentcolorurrentcurrentcolorap="round"></path>
            </g>
        </svg>)
    } else {
        return (<svg className="w-4 h-auto dark:text-orange-500"
                     viewBox="0 0 24 24"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"></circle>
                <path d="M2 13C2 13 4.20085 15 6 15C7.21199 15 8.60628 14.0924 9.38725 13.5"
                      stroke="currentColor"
                      strokeWidth="1.5"></path>
                <path d="M14 14.2236C14.4713 14.6389 15.0875 15 15.8053 15C17.4948 15 17.4948 13 19.1842 13C20.2618 13 21.1102 13.8136 21.5835 14.4029"
                      stroke="currentColor"
                      strokeWidth="1.5"></path>
                <path d="M14.5 7L16 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                <path d="M19 7L20 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                <path d="M12 5L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                <path d="M10.5 7L9.13397 7.36603"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"></path>
                <path d="M16.6497 8.9766L16.7161 10.3893"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"></path>
                <path d="M20.6777 10.085L18.9996 11.5629"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"></path>
                <path d="M7 5L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                <path d="M6.79245 9.14385L6.20722 7.85641"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"></path>
                <path d="M5.66501 12.6415L6.50024 11.5002"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"></path>
                <path d="M3.68268 10.3496L3.60402 8.93757"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"></path>
                <path d="M7 20.6622C8.47087 21.513 10.1786 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"></path>
            </g>
        </svg>)
    }
}
