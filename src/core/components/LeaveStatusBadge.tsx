import {Badge} from "@/components/ui/badge.tsx";
import React from "react";
import {LEAVE_STATUS, LeaveStatus} from "@/constants/types/enums.ts";

type BadgeVariant = "default" | "secondary" | "destructive";

type LeaveStatusBadgeProps = {
    status: LeaveStatus
}

const toBadgeVariant = (status: LeaveStatus): BadgeVariant => {
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
        <Badge variant={toBadgeVariant(status)}>{LEAVE_STATUS[status]}</Badge>
    )
}