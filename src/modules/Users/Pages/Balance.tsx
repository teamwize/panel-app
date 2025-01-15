import React, {useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {getLeaves, getLeavesBalance} from "@/services/leaveService.ts";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from '~/utils/errorHandler.ts';
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {Card} from "@/components/ui/card";
import {LeaveResponse, UserLeaveBalanceResponse} from "@/constants/types/leaveTypes.ts";
import BalanceItem from "@/core/components/BalanceItem.tsx";
import LeaveRequestList from "@/core/components/LeaveRequestList.tsx";
import {UserContext} from "@/contexts/UserContext.tsx";
import {usePageTitle} from "@/contexts/PageTitleContext.tsx";

// 1.Fetch leave types, amount and used amount
// 2.Fetch user leave history by detail

export default function BalancePage() {
    const [balanceData, setBalanceData] = useState<UserLeaveBalanceResponse[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<LeaveResponse[]>([]);
    const navigate = useNavigate();
    const {user} = useContext(UserContext);
    const { setTitle, setChildren } = usePageTitle();

    useEffect(() => {
        setTitle("Balance");
        setChildren(
            <Button className='px-2 h-9' onClick={() => navigate("/leave/create")}>
                <Plus className="h-4 w-4 mr-1" />
                Request Leave
            </Button>
        );
    }, [setTitle, setChildren, navigate]);

    // Fetch Leave Requests and User Balance
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
        <main className="flex flex-1 flex-col gap-4 p-4">
            <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1">
                <div className="grid grid-cols-3 text-center gap-2 p-4 mx-auto">
                    {balanceData.map((item) => (<BalanceItem item={item}/>))}
                </div>
                <LeaveRequestList leaveRequests={leaveRequests}/>
            </Card>
        </main>
    );
}