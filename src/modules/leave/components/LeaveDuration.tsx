import React from "react";
import {TableCell} from "@/components/ui/table.tsx";
import {clsx} from "clsx";
import {Clock} from "lucide-react";

type LeaveDurationProps = {
    duration: number | 0;
    className?: string;
}

export default function LeaveDuration({duration, className}: LeaveDurationProps) {
    return (
        <TableCell className={clsx(className)}>
            <div className={`inline-flex items-center gap-2 ${className}`}>

                <Clock className="w-5 h-5 text-primary"/>

            {duration ? `${duration} ${duration === 1 ? 'Day' : 'Days'}` : "0 Day"}
            </div>
        </TableCell>
    )
}