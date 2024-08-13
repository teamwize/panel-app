import React, { ReactNode } from "react";

type AlertProps = {
    children: ReactNode;
};

export default function Alert({ children }: AlertProps) {
    return (
        <div className="text-xs leading-6 text-red-500 mt-1">
            {children}
        </div>
    );
}