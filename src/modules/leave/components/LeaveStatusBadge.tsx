import {Badge} from "@/components/ui/badge.tsx";
import React from "react";
import {LeaveStatus, LeaveStatusJson} from "@/core/types/enum.ts";

type BadgeVariant = "approved" | "pending" | "rejected";

type LeaveStatusBadgeProps = {
    status: LeaveStatus
}

const toBadgeVariant = (status: LeaveStatus): BadgeVariant => {
    switch (status) {
        case 'ACCEPTED':
            return 'approved';
        case 'PENDING':
            return 'pending';
        case 'REJECTED':
            return 'rejected';
    }
}

export default function LeaveStatusBadge({status}: LeaveStatusBadgeProps) {
    return (
        <Badge variant={toBadgeVariant(status)}>{LeaveStatusJson[status]}</Badge>
    )
}