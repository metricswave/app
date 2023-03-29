import {app} from "../../config/app"

export default function Logo({className, ...props}: { className?: string }) {
    return (
            <a className={`${className} flex items-center space-x-4 text-zinc-900 dark:text-white`} href="/">
                <div className="inline-block rounded-sm h-6 w-6 bg-gradient-to-b from-pink-500 to-amber-500"></div>
                <span className="font-bold tracking-tighter">{app.name}</span>
            </a>
    )
}
