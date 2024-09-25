import { Label } from './index';
import { DayOffJson, DayOffColor, DayOffStatusColor, DayOffStatusJson } from '~/constants/types/enums';
import {DayOffResponse} from "@/constants/types/dayOffTypes";
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import {DayOffDuration} from "./index";

type DayOffRequestProps = {
    request: DayOffResponse;
}

export default function DayOffRequest({ request }: DayOffRequestProps) {
    return (
        <TableRow>
            <DayOffDuration request={request}/>
            <TableCell>
                <Label type={DayOffStatusColor[request.status]} text={DayOffStatusJson[request.status]} />
            </TableCell>
            <TableCell>
                <Label type={DayOffColor[request.type]} text={DayOffJson[request.type]} />
            </TableCell>
        </TableRow>
    );
}