import {Badge} from "@/components/ui/badge.tsx";
import React from "react";
import {DayOffStatus} from "@/constants/types/enums.ts";

type BadgeVariant = "default" | "secondary" | "destructive";

type LeaveStatusBadgeProps = {
    status: DayOffStatus
}

const toBadgeVariant = (status: DayOffStatus): BadgeVariant => {
    switch (status) {
        case DayOffStatus.ACCEPTED:
            return 'default';
        case DayOffStatus.PENDING:
            return 'secondary';
        case DayOffStatus.REJECTED:
            return 'destructive'
    }
}

export default function LeaveStatusBadge({status}: LeaveStatusBadgeProps) {
    return (
        <Badge variant={toBadgeVariant(status)}>{DayOffStatus[status]}</Badge>
    )
}