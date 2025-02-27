import React from "react";

type PageContentProps = {
    children: React.ReactNode
}

export default function PageContent({children}: PageContentProps) {
    return (
        <div className="container right-0 left-0 mx-auto p-4">
            {children}
        </div>
    )
}