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
import {PagedResponse} from "@/core/types/common.ts";
import {PageSection} from "@/components/layout/PageSection.tsx";

// 1.Fetch leave types, amount and used amount
// 2.Fetch user leave history by detail

export default function HomePage() {
    const [balanceData, setBalanceData] = useState<UserLeaveBalanceResponse[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<PagedResponse<LeaveResponse> | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    const fetchLeaveRequests = async (page = 0) => {
        try {
            const userLeaves = await getLeaves({userId: user?.id}, page);
            setLeaveRequests(userLeaves);
        } catch (error) {
            toast({
                title: "Error",
                description: getErrorMessage(error as Error),
                variant: "destructive",
            });
        }
    }

    const fetchLeaveBalance = async () => {
        try {
            const userBalance = await getLeavesBalance();
            setBalanceData(userBalance);
        } catch (error) {
            toast({
                title: "Error",
                description: getErrorMessage(error as Error),
                variant: "destructive",
            });
        }
    }

    useEffect(() => {
        if (!user) return;
        fetchLeaveRequests(currentPage);
        fetchLeaveBalance();
    }, [user, currentPage]);

    return (
        <>
            <PageHeader title='Home'>
                <Button className='px-2 h-9'
                        onClick={() => navigate("/leaves/create", {state: {from: location.pathname}})}>
                    <Plus className="h-4 w-4 mr-1"/>
                    Request Leave
                </Button>
            </PageHeader>
            <PageContent>
                <div>
                    <div className="w-full">
                        <PageSection title="Leave Balance"
                                     description="An overview of your leave balance, categorized by different leave types, showing the total allocation, used days, and remaining balance for each type.">
                        </PageSection>

                        <div className="flex flex-wrap justify-center gap-6">
                            {balanceData.map((item) => (
                                <UserLeaveBalanceItem
                                    key={item.activatedType.typeId}
                                    item={item}
                                />
                            ))}
                        </div>
              
                    </div>

                    <div className="w-full">
                        {leaveRequests && (
                            <>
                                <PageSection
                                    title="My Leaves"
                                    description="A detailed list of your leave requests"
                                >
                                </PageSection>
                                <Card>
                                    <LeaveList
                                        leaveRequests={leaveRequests}
                                        setCurrentPage={setCurrentPage}
                                    />
                                </Card>
                            </>
                        )}
                    </div>
                </div>
            </PageContent>
        </>
    );
}