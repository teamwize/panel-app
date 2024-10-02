import {LeaveResponse} from "@/constants/types/leaveTypes.ts";
import React from "react";
import {TableCell} from "@/components/ui/table";
import { calculateDuration, formatDurationRange } from '@/utils/dateUtils';

type LeaveDurationProps = {
    request: LeaveResponse
}

export default function LeaveDuration({request}: LeaveDurationProps) {
    const duration = calculateDuration(request.startAt, request.endAt);
    const durationText = formatDurationRange(request.startAt, request.endAt);

    return (
        <>
            <TableCell>{durationText}</TableCell>
            <TableCell>{duration} {duration === 1 ? "Day" : "Days"}</TableCell>
        </>
    )
}