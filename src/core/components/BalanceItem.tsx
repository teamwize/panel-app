import {BalanceGraph} from "@/core/components/index.ts";
import React from "react";
import {UserLeaveBalanceResponse} from "@/constants/types/leaveTypes.ts";

type BalanceItemProps = {
    item: UserLeaveBalanceResponse;
};

export default function BalanceItem({item}: BalanceItemProps) {
    return (
        <div key={item.type?.id} className="border rounded-lg p-2 bg-[hsl(var(--muted)/0.4)]">
            <BalanceGraph
                title={item.type?.name}
                used={item.usedAmount}
                quantity={item.totalAmount}
            />
        </div>
    )
}