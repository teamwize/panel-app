import {DayOffResponse} from "@/constants/types/dayOffTypes";
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import {DayOffDuration} from "./index";
import { Badge } from "@/components/ui/badge"

type DayOffRequestProps = {
    request: DayOffResponse;
}

export default function DayOffRequest({ request }: DayOffRequestProps) {
    return (
        <TableRow>
            <DayOffDuration request={request}/>
            <TableCell>
                <Badge >{request.status}</Badge>
            </TableCell>
            <TableCell>
                <Badge variant="outline">{request.type}</Badge>
            </TableCell>
        </TableRow>
    );
}

