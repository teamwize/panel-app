import React from "react";
import {UserLeaveBalanceResponse} from "@/core/types/leave.ts";
import UserLeaveBalanceGraph from "@/modules/home/components/UserLeaveBalanceGraph.tsx";

type BalanceItemProps = {
    item: UserLeaveBalanceResponse;
};

export default function UserLeaveBalanceItem({item}: BalanceItemProps) {
    return (
        <div key={item.activatedType?.typeId} className="border rounded-lg p-2 bg-[hsl(var(--muted)/0.4)]">
            <UserLeaveBalanceGraph
                title={item.activatedType?.name}
                used={item.usedAmount}
                quantity={item.totalAmount}
            />
        </div>
    )
}