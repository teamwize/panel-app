import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "~/utils/errorHandler.ts"
import {Card} from "@/components/ui/card";
import {LeaveResponse, UserLeaveBalanceResponse} from '@/constants/types/leaveTypes.ts';
import {ChevronLeft} from "lucide-react";
import {getLeaves, getLeavesBalance} from "@/services/leaveService.ts";
import LeaveRequestList from "@/core/components/LeaveRequestList.tsx";
import BalanceItem from "@/core/components/BalanceItem.tsx";

export default function EmployeeInformation() {
    const [balanceData, setBalanceData] = useState<UserLeaveBalanceResponse[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<LeaveResponse[]>([]);
    const navigate = useNavigate();
    const {id} = useParams();

    // Fetch Leave Requests and Employee Balance
    useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                const userLeaves = await getLeaves({userId: Number(id)});
                const userBalance = await getLeavesBalance(Number(id));
                setLeaveRequests(userLeaves.contents);
                setBalanceData(userBalance);
            } catch (error) {
                handleError("Failed to fetch leave requests", error);
            }
        };
        fetchLeaveRequests();
    }, [id]);

    const handleError = (title: string, error: unknown) => {
        const errorMessage = getErrorMessage(error as Error | string);
        console.error(`${title}:`, error);
        toast({
            title,
            description: errorMessage,
            variant: "destructive",
        });
    };

    // Navigate to Create Leave Request
    const goBack = () => navigate('/requests')

    return (
        <>
            <div className="flex flex-wrap text-lg font-medium px-4 pt-4 gap-2">
                <button onClick={goBack}>
                    <ChevronLeft className="h-6 w-6"/>
                </button>
                <h1 className="text-lg font-semibold md:text-2xl">Employee Information</h1>
            </div>

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4 gap-4" x-chunk="dashboard-02-chunk-1">
                    <div className="grid grid-cols-3 text-center gap-2 mx-auto">
                        {balanceData.map((item) => (<BalanceItem item={item}/>))}
                    </div>
                    <LeaveRequestList leaveRequests={leaveRequests}/>
                </Card>
            </main>
        </>
    )
}