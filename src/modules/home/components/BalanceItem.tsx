import React from "react";
import {UserLeaveBalanceResponse} from "@/core/types/leave.ts";
import BalanceGraph from "@/modules/home/components/BalanceGraph.tsx";

type BalanceItemProps = {
    item: UserLeaveBalanceResponse;
};

export default function BalanceItem({item}: BalanceItemProps) {
    return (
        <div key={item.activatedType?.typeId} className="border rounded-lg p-2 bg-[hsl(var(--muted)/0.4)]">
            <BalanceGraph
                title={item.activatedType?.name}
                used={item.usedAmount}
                quantity={item.totalAmount}
            />
        </div>
    )
}