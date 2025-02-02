import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getLeaves, getLeavesBalance} from "@/core/services/leaveService.ts";
import {toast} from "@/components/ui/use-toast.ts";
import {getErrorMessage} from '@/core/utils/errorHandler.ts';
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";
import {Card} from "@/components/ui/card.tsx";
import {LeaveResponse, UserLeaveBalanceResponse} from "@/core/types/leave.ts";
import UserLeaveBalanceItem from "@/modules/home/components/UserLeaveBalanceItem.tsx";
import LeaveList from "@/modules/leave/components/LeaveList.tsx";
import {UserContext} from "@/contexts/UserContext.tsx";
import PageContent from "@/components/layout/PageContent.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";

// 1.Fetch leave types, amount and used amount
// 2.Fetch user leave history by detail

export default function HomePage() {
    const [balanceData, setBalanceData] = useState<UserLeaveBalanceResponse[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<LeaveResponse[]>([]);
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    // Fetch leave Requests and User Balance
    useEffect(() => {
        if(!user) return;
        const fetchLeaveRequests = async () => {
            try {
                const userLeaves = await getLeaves({userId: user?.id});
                const userBalance = await getLeavesBalance();
                setLeaveRequests(userLeaves.contents);
                setBalanceData(userBalance);
            } catch (error) {
                handleError("Failed to fetch leave requests", error);
            }
        };
        fetchLeaveRequests();
    }, [user]);

    const handleError = (title: string, error: unknown) => {
        const errorMessage = getErrorMessage(error as Error | string);
        console.error(`${title}:`, error);
        toast({
            title,
            description: errorMessage,
            variant: "destructive",
        });
    };

    return (
        <>
            <PageHeader title='Home'>
                <Button className='px-2 h-9' onClick={() => navigate("/leaves/create")}>
                    <Plus className="h-4 w-4 mr-1"/>
                    Request Leave
                </Button>
            </PageHeader>
            <PageContent>
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm"
                      x-chunk="dashboard-02-chunk-1">
                    <div className="grid grid-cols-3 text-center gap-2 p-4 mx-auto">
                        {balanceData.map((item) => (<UserLeaveBalanceItem key={item.activatedType.typeId} item={item}/>))}
                    </div>
                    <LeaveList leaveRequests={leaveRequests}/>
                </Card>
            </PageContent>
        </>
    );
}