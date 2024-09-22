import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {getDaysoff} from '~/services/WorkiveApiClient.ts';
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from '~/utils/errorHandler.ts';
import {PageTitle, DayOffRequest, Pagination, BalanceGraph} from '../../../core/components';
import {DayOffResponse, Balance} from '~/constants/types';
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableHead, TableHeader, TableRow, TableBody, TableCell} from "@/components/ui/table";
import dayjs from "dayjs";

export default function BalancePage() {
    const [balanceValue, setBalanceValue] = useState<Balance[]>([]);
    const [requestsList, setRequestsList] = useState<DayOffResponse[]>([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage: number = 5;

    // Example balance data
    const balanceExample: Balance[] = [
        {label: 'Vacation', dayOffTypeQuantity: 18, dayOffTypeUsed: 3, dayOffTypeColor: '#088636'},
        {label: 'Sick leave', dayOffTypeQuantity: 5, dayOffTypeUsed: 2, dayOffTypeColor: '#ef4444'},
        {label: 'Paid time off', dayOffTypeQuantity: 5, dayOffTypeUsed: 1, dayOffTypeColor: '#3b87f7'},
    ];

    // Get list of requests
    useEffect(() => {
        getDaysoff()
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
        navigate('/dayoff/create');
    };

    const calculateDistance = (startAt: string, endAt: string): number => {
        return dayjs(endAt).diff(startAt, "day") + 1;
    };

    return (
        <>
            <PageTitle title="Balance">
                <div className="flex justify-center">
                    <Button onClick={sendRequest}>
                        <Plus className="h-5 w-5"/>
                        Request Day Off
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
                                                    <DayOffRequest
                                                        request={request}
                                                        key={request.id}
                                                        calculateDistance={calculateDistance}
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
                dayOffTypeUsed={i.dayOffTypeUsed}
                dayOffTypeQuantity={i.dayOffTypeQuantity}
                dayOffTypeColor={i.dayOffTypeColor}
            />
        </div>
    );
}