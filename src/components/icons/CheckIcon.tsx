import {twMerge} from "../../helpers/TwMerge"

export default function CheckIcon({className}: { className?: string }) {
    return (<svg className={twMerge("h-auto", className ?? "")}
                 width="64px"
                 height="64px"
                 viewBox="0 0 24 24"
                 fill="none"
                 xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracurrentColorerCarrier" strokeLinejoin="round"></g>
        <g id="SVGRepo_icurrentColoronCarrier">
            <path d="M4 12.6111L8.92308 17.5L20 6.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"></path>
        </g>
    </svg>)
}
