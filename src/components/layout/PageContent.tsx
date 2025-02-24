import React from "react";

type PageContentProps = {
    children: React.ReactNode
}

export default function PageContent({children}: PageContentProps) {
    return (
        <div className="container mx-auto p-4">
            {children}
        </div>
    )
}