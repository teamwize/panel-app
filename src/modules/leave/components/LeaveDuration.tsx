import React from "react";
import {TableCell} from "@/components/ui/table.tsx";
import {clsx} from "clsx";

type LeaveDurationProps = {
    duration: number | 0;
    className?: string;
}

export default function LeaveDuration({duration, className}: LeaveDurationProps) {
    return (
        <TableCell className={clsx(className)}>
            {duration ? `${duration} ${duration === 1 ? 'Day' : 'Days'}` : "0 Day"}
        </TableCell>
    )
}