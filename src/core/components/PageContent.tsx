import React from "react";

type PageContentProps = {
    children: React.ReactNode
}

export default function PageContent({children}: PageContentProps) {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            {children}
        </div>
    )
}