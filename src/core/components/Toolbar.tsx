import React from "react";
import { usePageTitle } from "@/contexts/PageTitleContext";

export default function Toolbar() {
    const { title, children } = usePageTitle();

    return (
        <header className="flex flex-row-reverse h-16 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <div className="flex flex-1 justify-between items-center">
                <h1 className="text-base font-semibold md:text-xl">{title}</h1>
                {children && (<div className="flex items-center">{children}</div>)}
            </div>
        </header>
    );
}