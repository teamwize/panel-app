import React, {useEffect, useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import dayjs from 'dayjs';
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {DayOffModal} from '../Components';
import {getDaysoff, updateDayOffStatus} from "~/services/WorkiveApiClient.ts";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "~/utils/errorHandler.ts";
import {DayOffLeaveTypeJson, DayOffLeaveTypeColor} from '@/constants';
import {Label, Pagination} from '../../../core/components';
import {DayOffRequestStatus, DayOffResponse, PagedResponse} from '~/constants/types';
import {Eye} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {UserContext} from "@/contexts/UserContext";
import {UserResponse} from "@/constants/types";
import {getEmployee} from "@/services/WorkiveApiClient";

export default function Requests() {
    const navigate = useNavigate();
    const [requestsList, setRequestsList] = useState<DayOffResponse[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [selectedRequest, setSelectedRequest] = useState<DayOffResponse | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [teamRequests, setTeamRequests] = useState<DayOffResponse[]>([]);
    const recordsPerPage: number = 5;

    // Get dayoff list
    useEffect(() => {
        getDaysoff()
            .then((response: PagedResponse<DayOffResponse>) => {
                setRequestsList(response.contents.filter((item: DayOffResponse) => item.status === DayOffRequestStatus.PENDING));
            })
            .catch((error: any) => {
                setErrorMessage(getErrorMessage(error));
            });
    }, []);

    useEffect(() => {
        if (selectedRequest) {
            const teamName: string = selectedRequest.user.team.name;
            const filteredRequest = requestsList.filter(r => r.user.team.name === teamName);
            setTeamRequests(filteredRequest)
        }
    }, [selectedRequest, requestsList])

    const handleRowClick = (request: DayOffResponse) => {
        setSelectedRequest(request);
    };

    const handleRequest = (status: DayOffRequestStatus, id: number) => {
        let payload = {status: status};
        setIsProcessing(true);

        updateDayOffStatus(payload, id)
            .then((data: DayOffResponse) => {
                setIsProcessing(false);
                setRequestsList(prevState => prevState.filter(r => r.id !== id));
                setSelectedRequest(null);
                toast({
                    title: "Success",
                    description: "Request accepted.",
                    variant: "default",
                });
            })
            .catch((error: string | null) => {
                setIsProcessing(false);
                const errorMessage = getErrorMessage(error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            })
    };

    const calculateDistance = (startAt: string, endAt: string): number => {
        return dayjs(endAt).diff(startAt, 'day') + 1;
    };

    return (
        <>
            <div className="flex flex-wrap text-lg font-medium px-4 pt-4 gap-2">
                <h1 className="text-lg font-semibold md:text-2xl">Requests</h1>
            </div>

            {errorMessage && (
                <Alert>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4 gap-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requestsList
                                .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
                                .map((request) => (
                                    <RequestRowItem
                                        key={request.id}
                                        request={request}
                                        calculateDistance={calculateDistance}
                                        onClick={() => handleRowClick(request)}
                                    />
                                ))}
                        </TableBody>
                    </Table>

                    {requestsList.length > recordsPerPage && (
                        <Pagination
                            pageSize={recordsPerPage}
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalContents={requestsList.length}
                        />
                    )}
                </Card>

                {selectedRequest && (
                    <DayOffModal
                        teamRequests={teamRequests}
                        selectedRequest={selectedRequest}
                        handleModal={() => setSelectedRequest(null)}
                        handleRequest={handleRequest}
                        isProcessing={isProcessing}
                        calculateDistance={calculateDistance}
                    />
                )}
            </main>
        </>
    );
}

type RequestItemProps = {
    request: DayOffResponse;
    calculateDistance: (startAt: string, endAt: string) => number;
    onClick: (request: DayOffResponse) => void;
};

function RequestRowItem({request, calculateDistance, onClick}: RequestItemProps) {
    const distance: number = calculateDistance(request.startAt, request.endAt);
    const {accessToken} = useContext(UserContext)
    const navigate = useNavigate();

    const viewBalance = (id: string) => {
        navigate('/balance?query=' + id);
    };

    return (
        <TableRow>
            <TableCell className="flex items-center gap-2 font-medium">
                <img
                    className="h-10 w-10 rounded-full"
                    src={
                        request.user?.avatar
                            ? `${request.user?.avatar?.url}?token=${accessToken}`
                            : "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
                    }
                    alt="User avatar"
                />
                <h2
                    className="cursor-pointer text-sm font-medium text-blue-600 underline hover:text-blue-800"
                    onClick={() => viewBalance(request.user.team.name)}
                >
                    {request.user.firstName} {request.user.lastName}
                </h2>
            </TableCell>
            <TableCell>{request.user.team.name}</TableCell>
            <TableCell>
                <Label type={DayOffLeaveTypeColor[request.type]} text={DayOffLeaveTypeJson[request.type]}/>
            </TableCell>
            <TableCell>
                {distance === 1
                    ? dayjs(request.startAt).format("D MMM YYYY")
                    : `${dayjs(request.startAt).format("D MMM YYYY")} - ${dayjs(request.endAt).format("D MMM YYYY")}`}
            </TableCell>
            <TableCell>
                {distance} {distance === 1 ? "Day" : "Days"}
            </TableCell>
            <TableCell>
                <Button  className={"px-1"}
                         variant="outline"
                         size="sm">
                    <Eye onClick={() => viewBalance(request.user.team.name)} className="h-4 text-[#3b87f7]"/>
                </Button>
            </TableCell>
        </TableRow>
    );
}