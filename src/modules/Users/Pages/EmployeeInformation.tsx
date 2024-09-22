import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import {getUserDaysoff} from "~/services/WorkiveApiClient.ts"
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "~/utils/errorHandler.ts"
import {DayOffRequest, BalanceGraph, Pagination} from '../../../core/components'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {DayOffResponse} from '~/constants/types';
import dayjs from "dayjs";
import {ChevronLeft} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

type Balance = {
    label: "Vacation" | "Sick leave" | "Paid time off";
    dayOffTypeQuantity: number;
    dayOffTypeUsed: number;
    dayOffTypeColor: string;
}

export default function EmployeeInformation() {
    const [balanceValue, setBalanceValue] = useState<Balance[]>([])
    const [requestsList, setRequestsList] = useState<DayOffResponse[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const {id} = useParams();
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
        getUserDaysoff(Number(id))
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

    const goBack = () => navigate('/employees')

    const calculateDistance = (startAt: string, endAt: string): number => {
        return dayjs(endAt).diff(startAt, "day") + 1;
    };

    return (
        <>
            <div className="flex flex-wrap text-lg font-medium px-4 pt-4 gap-2">
                <button onClick={goBack}>
                    <ChevronLeft className="h-6 w-6"/>
                </button>
                <h1 className="text-lg font-semibold md:text-2xl">Employee Information</h1>
            </div>

            {errorMessage && (
                <Alert>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4 gap-4"
                      x-chunk="dashboard-02-chunk-1">
                    <div className="grid grid-cols-3 text-center gap-2 mx-auto">
                        {balanceExample.map((i) => (
                            <BalanceItem i={i} key={i.label}/>
                        ))}
                    </div>

                    <div>
                        <Card x-chunk="dashboard-05-chunk-3" className="border-0 shadow-amber-50">
                            <CardHeader className="px-6 py-4">
                                <CardTitle className="text-xl">
                                    Requests ({requestsList.length})
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
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
                                <Pagination
                                    pageSize={recordsPerPage}
                                    pageNumber={currentPage}
                                    setPageNumber={setCurrentPage}
                                    totalContents={requestsList.length}
                                />
                            )}
                        </Card>
                    </div>
                </Card>
            </main>
        </>
    )
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