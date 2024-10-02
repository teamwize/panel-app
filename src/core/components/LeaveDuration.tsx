import React from "react";
import {TableCell} from "@/components/ui/table";
import { formatDurationRange } from '@/utils/dateUtils';
import {LeaveResponse} from "@/constants/types/leaveTypes.ts";

type LeaveDurationProps = {
    request: LeaveResponse;
}

export default function LeaveDuration({request}: LeaveDurationProps) {
    const durationText = formatDurationRange(request.duration, request.startAt, request.endAt);

    return (
        <>
            <TableCell>{durationText}</TableCell>
            <TableCell>{request.duration} {request.duration === 1 ? "Day" : "Days"}</TableCell>
        </>
    )
}