import {DayOffResponse} from "@/constants/types/dayOffTypes";
import React from "react";
import {TableCell} from "@/components/ui/table";
import { calculateDuration, formatDurationRange } from '@/utils/dateUtils';

type DayOffDurationProps = {
    request: DayOffResponse
}

export default function DayOffDuration({request}: DayOffDurationProps) {
    const duration = calculateDuration(request.startAt, request.endAt);
    const durationText = formatDurationRange(request.startAt, request.endAt);

    return (
        <>
            <TableCell>{durationText}</TableCell>
            <TableCell>{duration} {duration === 1 ? "Day" : "Days"}</TableCell>
        </>
    )
}