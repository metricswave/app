import {twMerge} from "../../helpers/TwMerge"

export default function DragIcon({className}: { className?: string }) {
    return (<svg className={twMerge("h-auto", className ?? "")}
                 width="64px"
                 height="64px"
                 viewBox="-0.5 0 25 25"
                 fill="none"
                 xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <path d="M2 12.32H22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"></path>
            <path d="M2 18.32H22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"></path>
            <path d="M2 6.32001H22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"></path>
        </g>
    </svg>)
}
