import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {getLeaves} from "@/services/leaveService.ts";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from '~/utils/errorHandler.ts';
import {PageTitle, LeaveRequestTable, Pagination, BalanceGraph} from '../../../core/components';
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableHead, TableHeader, TableRow, TableBody, TableCell} from "@/components/ui/table";
import dayjs from "dayjs";
import {Balance} from "@/constants/types/commonTypes";
import {LeaveResponse} from "@/constants/types/leaveTypes.ts";

export default function BalancePage() {
    const [balanceValue, setBalanceValue] = useState<Balance[]>([]);
    const [requestsList, setRequestsList] = useState<LeaveResponse[]>([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage: number = 5;

    // Example balance data
    const balanceExample: Balance[] = [
        {label: 'Vacation', leaveQuantity: 18, leaveUsed: 3, leaveColor: '#088636'},
        {label: 'Sick leave', leaveQuantity: 5, leaveUsed: 2, leaveColor: '#ef4444'},
        {label: 'Paid time off', leaveQuantity: 5, leaveUsed: 1, leaveColor: '#3b87f7'},
    ];

    // Get list of requests
    useEffect(() => {
        getLeaves()
            .then((data) => {
                console.log('Success:', data.contents);
                setRequestsList(data.contents);
            })
            .catch((error) => {
                console.error('Error:', error);
                const errorMessage = getErrorMessage(error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            });
    }, []);

    const sendRequest = () => {
        navigate('/leave/create');
    };

    return (
        <>
            <PageTitle title="Balance">
                <div className="flex justify-center">
                    <Button onClick={sendRequest}>
                        <Plus className="h-5 w-5"/>
                        Request Leave
                    </Button>
                </div>
            </PageTitle>

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card
                    className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm"
                    x-chunk="dashboard-02-chunk-1"
                >
                    <div className="grid grid-cols-3 text-center gap-2 p-4 mx-auto">
                        {balanceExample.map((i) => (
                            <BalanceItem i={i} key={i.label}/>
                        ))}
                    </div>

                    <div>
                        <Card x-chunk="dashboard-05-chunk-3" className="border-0 shadow-amber-50">
                            <CardHeader className="px-6 py-4">
                                <CardTitle className="text-xl">
                                    History ({requestsList.length})
                                </CardTitle>
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
                                        {requestsList.length > 0 ? (
                                            requestsList
                                                .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
                                                .map((request) => (
                                                    <LeaveRequestTable
                                                        request={request}
                                                        key={request.id}
                                                    />
                                                ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center">
                                                    There is no pending request
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>

                            {requestsList.length > recordsPerPage && (
                                <div className='mx-6'>
                                    <Pagination
                                        pageSize={recordsPerPage}
                                        pageNumber={currentPage}
                                        setPageNumber={setCurrentPage}
                                        totalContents={requestsList.length}
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
    i: Balance;
};

function BalanceItem({i}: BalanceItemProps) {
    return (
        <div
            className="border rounded-lg p-2 bg-[hsl(var(--muted)/0.4)]">
            <BalanceGraph
                title={i.label}
                used={i.leaveUsed}
                quantity={i.leaveQuantity}
                color={i.leaveColor}
            />
        </div>
    );
}