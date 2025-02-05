import React from "react";

type PageContentProps = {
    children: React.ReactNode
}

export default function PageContent({children}: PageContentProps) {
    return (
        <div className="container mx-auto py-8">
            {children}
        </div>
    )
}