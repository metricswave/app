import React from "react";
import { twMerge } from "../../helpers/TwMerge";

type Props = {
    title?: string;
    description?: string;
    className?: string;
    titleClassName?: string;
    children?: React.ReactNode;
};

export default function PageTitle({ title, description, titleClassName, className, children, ...props }: Props) {
    return (
        <div className={twMerge("flex flex-col space-y-2 mb-4k", className)} {...props}>
            {children && children}

            {!children && (
                <>
                    <h1 className={twMerge("text-lg font-bold", titleClassName)}>{title}</h1>
                    {description && <p className="text-sm opacity-70">{description}</p>}
                </>
            )}
        </div>
    );
}
