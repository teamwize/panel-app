import React from "react";
import {TableCell} from "@/components/ui/table.tsx";
import {calculateDuration} from '@/core/utils/date.ts';
import {LeaveResponse} from "@/core/types/leave.ts";

type LeaveDurationProps = {
    request: LeaveResponse;
}

export default function LeaveDuration({request}: LeaveDurationProps) {
    const duration = calculateDuration(request.startAt, request.endAt);

    return (
        <>
            <TableCell>{duration} {duration === 1 ? 'Day' : 'Days'}</TableCell>
        </>
    )
}