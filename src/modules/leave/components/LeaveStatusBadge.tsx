import {Badge} from "@/components/ui/badge.tsx";
import React from "react";
import {LeaveStatus, LeaveStatusJson} from "@/core/types/enum.ts";
import {cn} from "@/core/utils/style.ts";

// Custom styles specific to Leave Statuses
const statusStyles: Record<LeaveStatus, string> = {
    ACCEPTED: "bg-green-100 text-green-900 hover:bg-green-200",
    PENDING: "bg-blue-100 text-blue-900 hover:bg-blue-200",
    REJECTED: "bg-red-100 text-red-900 hover:bg-red-200",
};

type LeaveStatusBadgeProps = {
    status: LeaveStatus;
};

export default function LeaveStatusBadge({status}: LeaveStatusBadgeProps) {
    return (
        <Badge className={cn(statusStyles[status])}>
            {LeaveStatusJson[status]}
        </Badge>
    );
}