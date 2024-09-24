import dayjs from 'dayjs';
import { Label } from './index';
import { DayOffJson, DayOffColor, DayOffStatusColor, Status } from '~/constants/types/enums';
import {DayOffResponse} from "@/constants/types/dayOffTypes";
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

type DayOffRequestProps = {
    request: DayOffResponse;
    calculateDistance: (startAt: string, endAt: string) => number;
}

export default function DayOffRequest({ request, calculateDistance }: DayOffRequestProps) {
    const distance: number = calculateDistance(request.startAt, request.endAt);

    return (
        <TableRow>
            <TableCell>
                {distance === 1
                    ? dayjs(request.startAt).format("D MMM")
                    : `${dayjs(request.startAt).format("D MMM")} - ${dayjs(request.endAt).format("D MMM")}`}
            </TableCell>
            <TableCell>{distance} {distance === 1 ? "Day" : "Days"}</TableCell>
            <TableCell>
                <Label type={DayOffStatusColor[request.status]} text={Status[request.status]} />
            </TableCell>
            <TableCell>
                <Label type={DayOffColor[request.type]} text={DayOffJson[request.type]} />
            </TableCell>
        </TableRow>
    );
}