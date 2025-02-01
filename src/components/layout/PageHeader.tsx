import React, {ReactNode} from "react";
import {Button} from "@/components/ui/button.tsx";
import {ChevronLeft} from "lucide-react";
import {useNavigate} from "react-router-dom";

type PageHeaderProps = {
    title: string;
    children?: ReactNode;
    backButton?: string;
}

export default function PageHeader({title, children, backButton}: PageHeaderProps) {
    const navigate = useNavigate();
    return (
        <header className="flex flex-row-reverse h-16 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <div className={"container mx-auto"}>
                <div className="flex flex-1 justify-between items-center">
                    <h1 className="text-base font-semibold md:text-xl ">
                        <div className={"flex items-center gap-2"}>
                            {backButton && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate(backButton)}
                                    className="w-fit justify-start p-0 hover:bg-transparent focus:ring-0"
                                >
                                    <ChevronLeft className="h-5 w-5"/>
                                </Button>
                            )}
                            {title}
                        </div>
                    </h1>
                    {children && (<div className="flex items-center">{children}</div>)}
                </div>
            </div>
        </header>
    );
}