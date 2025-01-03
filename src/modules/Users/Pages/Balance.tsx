import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {getLeaves, getLeavesBalance} from "@/services/leaveService.ts";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from '~/utils/errorHandler.ts';
import {PageTitle, LeaveRequestTable, Pagination, BalanceGraph} from '../../../core/components';
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableHead, TableHeader, TableRow, TableBody, TableCell} from "@/components/ui/table";
import {LeaveResponse, UserLeaveBalanceResponse} from "@/constants/types/leaveTypes.ts";

// 1.Fetch leave types, amount and used amount
// 2.Fetch user leave history by detail

export default function BalancePage() {
    const [balanceData, setBalanceData] = useState<UserLeaveBalanceResponse[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<LeaveResponse[]>([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage: number = 5;

    // Fetch Leave Requests
    useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                const data = await getLeaves();
                setLeaveRequests(data.contents);
            } catch (error) {
                handleError("Failed to fetch leave requests", error);
            }
        };
        fetchLeaveRequests();
    }, []);

    // Fetch Leave Balances
    useEffect(() => {
        const fetchLeaveBalance = async () => {
            try {
                const data = await getLeavesBalance();
                setBalanceData(data);
            } catch (error) {
                handleError("Failed to fetch leave balances", error);
            }
        };
        fetchLeaveBalance();
    }, []);

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
    const handleCreateRequest = () => {
        navigate("/leave/create");
    };

    return (
        <>
            <PageTitle title="Balance">
                <div className="flex justify-center">
                    <Button onClick={handleCreateRequest}>
                        <Plus className="h-5 w-5"/>
                        Request Leave
                    </Button>
                </div>
            </PageTitle>

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1">
                    <div className="grid grid-cols-3 text-center gap-2 p-4 mx-auto">
                        {balanceData.map((item) => (
                            <BalanceItem item={item} />
                        ))}
                    </div>

                    <div>
                        <Card x-chunk="dashboard-05-chunk-3" className="border-0 shadow-amber-50">
                            <CardHeader className="px-6 py-4">
                                <CardTitle className="text-xl">Leaves History ({leaveRequests.length})</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Type</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {leaveRequests.length > 0 ? (
                                            leaveRequests
                                                .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
                                                .map((request) => (
                                                    <LeaveRequestTable request={request} key={request?.id}/>
                                                ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center">There is no pending request</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>

                            {leaveRequests.length > recordsPerPage && (
                                <div className='mx-6'>
                                    <Pagination
                                        pageSize={recordsPerPage}
                                        pageNumber={currentPage}
                                        setPageNumber={setCurrentPage}
                                        totalContents={leaveRequests.length}
                                    />
                                </div>
                            )}
                        </Card>
                    </div>
                </Card>
            </main>
        </>
    );
}

type BalanceItemProps = {
    item: UserLeaveBalanceResponse;
};

function BalanceItem({item}: BalanceItemProps) {
    return (
        <div key={item.type?.id} className="border rounded-lg p-2 bg-[hsl(var(--muted)/0.4)]">
            <BalanceGraph
                title={item.type?.name}
                used={item.usedAmount}
                quantity={item.totalAmount}
            />
        </div>
    );
}