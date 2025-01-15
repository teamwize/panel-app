import React, { createContext, useContext, useState, ReactNode } from "react";

type PageTitleContextType = {
    title: ReactNode;
    setTitle: (title: ReactNode) => void;
    children: ReactNode;
    setChildren: (children: ReactNode) => void;
};

const PageTitleContext = createContext<PageTitleContextType | undefined>(undefined);

export const PageTitleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [title, setTitle] = useState<ReactNode>("");
    const [contextChildren, setChildren] = useState<ReactNode>(null);

    return (
        <PageTitleContext.Provider value={{ title, setTitle, children: contextChildren, setChildren }}>
            {children}
        </PageTitleContext.Provider>
    );
};

export const usePageTitle = () => {
    const context = useContext(PageTitleContext);
    if (!context) {
        throw new Error("usePageTitle must be used within a PageTitleProvider");
    }
    return context;
};