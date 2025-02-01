import React, {ReactNode} from "react";

type SectionHeaderProps = {
    title: string;
    children?: ReactNode;
    description: string;
}

export function PageSection({title, description, children}: SectionHeaderProps) {
    return (
        <header className="flex flex-row-reverse items-center gap-4 py-8">
            <div className="flex flex-1 justify-between items-center">
                <h1 className="text-base">
                    <div className={"flex items-center gap-2"}>
                        <div>
                            <h2 className={" md:text-xl font-semibold"}>
                                {title}
                            </h2>
                            <div className={"text-gray-400 text-sm"}>{description}</div>
                        </div>
                    </div>
                </h1>
                {children && (<div className="flex items-center">{children}</div>)}
            </div>
        </header>
    );
}