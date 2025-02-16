import {Badge} from "@/components/ui/badge.tsx";
import React from "react";
import {LeaveStatus, LeaveStatusJson} from "@/core/types/enum.ts";
import {cn} from "@/core/utils/style.ts";

// Custom styles specific to Leave Statuses
const statusStyles: Record<LeaveStatus, string> = {
    ACCEPTED: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200 font-medium",
    PENDING: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 font-medium",
    REJECTED: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200 font-medium",
};

type LeaveStatusBadgeProps = {
    status: LeaveStatus;
};

export default function LeaveStatusBadge({status}: LeaveStatusBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={cn(
                "",
                statusStyles[status]
            )}
        >
            {LeaveStatusJson[status].toUpperCase()}
        </Badge>
    );
}