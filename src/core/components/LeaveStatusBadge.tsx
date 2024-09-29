import {Badge} from "@/components/ui/badge.tsx";
import React from "react";
import {DAY_OFF_STATUS, DayOffStatus} from "@/constants/types/enums.ts";

type BadgeVariant = "default" | "secondary" | "destructive";

type LeaveStatusBadgeProps = {
    status: DayOffStatus
}

const toBadgeVariant = (status: DayOffStatus): BadgeVariant => {
    switch (status) {
        case 'ACCEPTED':
            return 'default';
        case 'PENDING':
            return 'secondary';
        case 'REJECTED':
            return 'destructive'
    }
}

export default function LeaveStatusBadge({status}: LeaveStatusBadgeProps) {
    return (
        <Badge variant={toBadgeVariant(status)}>{DAY_OFF_STATUS[status]}</Badge>
    )
}