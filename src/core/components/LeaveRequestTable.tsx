import {LeaveResponse} from "@/constants/types/leaveTypes.ts";
import React from "react";
import {TableCell, TableRow} from "@/components/ui/table";
import {LeaveDuration} from "./index";
import {Badge} from "@/components/ui/badge"
import LeaveStatusBadge from "@/core/components/LeaveStatusBadge";
import {formatDurationRange} from "@/utils/dateUtils.ts";

type LeaveRequestTableProps = {
    request: LeaveResponse;
}

export default function LeaveRequestTable({request}: LeaveRequestTableProps) {
    const durationText = formatDurationRange(request.duration, request.startAt, request.endAt);

    return (
        <TableRow>
            <TableCell>{durationText}</TableCell>
            <LeaveDuration request={request}/>
            <TableCell>
                <LeaveStatusBadge status={request.status}/>
            </TableCell>
            <TableCell>
                <Badge variant="outline">{request.type.name}</Badge>
            </TableCell>
        </TableRow>
    );
}

