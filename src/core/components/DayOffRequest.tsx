import dayjs from 'dayjs';
import { DayOffLeaveTypeJson, DayOffStatusJson, DayOffLeaveTypeColor, DayOffStatusColor } from '~/constants/index.ts';
import { Label } from './index';
import { DayOffResponse } from '~/constants/types';
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
                <Label type={DayOffStatusColor[request.status]} text={DayOffStatusJson[request.status]} />
            </TableCell>
            <TableCell>
                <Label type={DayOffLeaveTypeColor[request.type]} text={DayOffLeaveTypeJson[request.type]} />
            </TableCell>
        </TableRow>
    );
}