import React from "react";
import {UserLeaveBalanceResponse} from "@/core/types/leave.ts";
import UserLeaveBalanceGraph from "@/modules/home/components/UserLeaveBalanceGraph.tsx";

type BalanceItemProps = {
    item: UserLeaveBalanceResponse;
};

export default function UserLeaveBalanceItem({item}: BalanceItemProps) {
    return (
        <div
            key={item.activatedType?.typeId}
            className="border rounded-lg p-4 bg-white"
        >
            <div className="flex flex-col items-center space-y-2">
                <h3 className="font-medium text-sm ">
                    {item.activatedType?.name}
                </h3>
                <UserLeaveBalanceGraph
                    title={item.activatedType?.name}
                    used={item.usedAmount}
                    quantity={item.totalAmount}
                />
                <div className="flex items-center space-x-4 text-sm mt-2">
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"/>
                        <span>Used: {item.usedAmount}</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"/>
                        <span>Remaining: {item.totalAmount - item.usedAmount}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}