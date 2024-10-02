import {LeaveResponse} from "@/constants/types/leaveTypes.ts";
import React from "react";
import {TableCell, TableRow} from "@/components/ui/table";
import {LeaveDuration} from "./index";
import {Badge} from "@/components/ui/badge"
import {LEAVE_TYPE} from "@/constants/types/enums";
import LeaveStatusBadge from "@/core/components/LeaveStatusBadge";

type LeaveRequestTableProps = {
    request: LeaveResponse;
}

export default function LeaveRequestTable({request}: LeaveRequestTableProps) {
    return (
        <TableRow>
            <LeaveDuration request={request}/>
            <TableCell>
                <LeaveStatusBadge status={request.status} />
            </TableCell>
            <TableCell>
                <Badge variant="outline">{LEAVE_TYPE[request.type]}</Badge>
            </TableCell>
        </TableRow>
    );
}

