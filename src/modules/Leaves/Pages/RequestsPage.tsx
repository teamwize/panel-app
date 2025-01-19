import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Card} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {LeaveDialog} from '../Components';
import {getLeaves, updateLeavesStatus} from "@/services/leaveService.ts";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "~/utils/errorHandler.ts";
import {LeaveDuration, Pagination} from '../../../core/components';
import {LeaveStatus} from '@/constants/types/enums';
import {LeaveResponse} from '@/constants/types/leaveTypes.ts';
import {PagedResponse} from '@/constants/types/commonTypes';
import {Eye} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge.tsx";
import {formatDurationRange} from "@/utils/dateUtils.ts";
import PageContent from "@/core/components/PageContent.tsx";
import {Avatar, PageHeader} from "@/core/components";

export default function RequestsPage() {
    const [requestsList, setRequestsList] = useState<LeaveResponse[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [selectedRequest, setSelectedRequest] = useState<LeaveResponse | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [teamRequests, setTeamRequests] = useState<LeaveResponse[]>([]);
    const recordsPerPage: number = 5;

    // Fetch pending leave requests
    useEffect(() => {
        getLeaves()
            .then((response: PagedResponse<LeaveResponse>) => {
                setRequestsList(response.contents.filter((item: LeaveResponse) => item.status === "PENDING"));
            })
            .catch((error) => {
                console.error("Error:", error);
                const errorMessage = getErrorMessage(error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive"
                });
            });
    }, []);

    // Filter team-specific requests when a request is selected
    useEffect(() => {
        if (selectedRequest) {
            const teamName: string = selectedRequest.user.team.name;
            const filteredRequest = requestsList.filter(r => r.user.team.name === teamName);
            setTeamRequests(filteredRequest)
        }
    }, [selectedRequest, requestsList])

    //View request details
    const handleRowClick = (request: LeaveResponse) => {
        setSelectedRequest(request);
    };

    // Handle leave request approval or rejection
    const handleRequest = (status: LeaveStatus, id: number) => {
        setIsProcessing(true);

        updateLeavesStatus({status}, id)
            .then(() => {
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

    return (
        <>
            <PageHeader title='Requests'></PageHeader>
            <PageContent>
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
                                        handleRowClick={() => handleRowClick(request)}
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
                    <LeaveDialog
                        teamRequests={teamRequests}
                        selectedRequest={selectedRequest}
                        toggleModal={() => setSelectedRequest(null)}
                        handleRequest={handleRequest}
                        isProcessing={isProcessing}
                    />
                )}
            </PageContent>
        </>
    );
}

type RequestItemProps = {
    request: LeaveResponse;
    handleRowClick: () => void;
};

function RequestRowItem({request, handleRowClick}: RequestItemProps) {
    const navigate = useNavigate();
    const durationText = formatDurationRange(request.duration, request.startAt, request.endAt);

    // Navigate to user balance
    const viewBalance = (id: number) => {
        navigate(`/employee/${id}/balance`);
    };

    return (
        <TableRow>
            <TableCell className="flex items-center gap-2 font-medium">
                <Avatar avatar={request.user?.avatar} avatarSize={32}/>
                <h2 className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
                    onClick={() => viewBalance(request.user.id)}
                >
                    {request.user.firstName} {request.user.lastName}
                </h2>
            </TableCell>
            <TableCell>{request.user.team.name}</TableCell>
            <TableCell>
                <Badge variant="outline">{request.type.type.name}</Badge>
            </TableCell>
            <TableCell>{durationText}</TableCell>
            <LeaveDuration request={request}/>
            <TableCell>
                <Button className={"px-1"} variant="outline" size="sm">
                    <Eye onClick={handleRowClick} className="h-4 text-[#3b87f7]"/>
                </Button>
            </TableCell>
        </TableRow>
    );
}