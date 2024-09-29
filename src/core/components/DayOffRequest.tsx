import {DayOffResponse} from "@/constants/types/dayOffTypes";
import React from "react";
import {TableCell, TableRow} from "@/components/ui/table";
import {DayOffDuration} from "./index";
import {Badge} from "@/components/ui/badge"
import {DAY_OFF_TYPE} from "@/constants/types/enums";
import LeaveStatusBadge from "@/core/components/LeaveStatusBadge";

type DayOffRequestProps = {
    request: DayOffResponse;
}

export default function DayOffRequest({request}: DayOffRequestProps) {
    return (
        <TableRow>
            <DayOffDuration request={request}/>
            <TableCell>
                <LeaveStatusBadge status={request.status} />
            </TableCell>
            <TableCell>
                <Badge variant="outline">{DAY_OFF_TYPE[request.type]}</Badge>
            </TableCell>
        </TableRow>
    );
}

