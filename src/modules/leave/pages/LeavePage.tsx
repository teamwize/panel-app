import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Card} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {getLeaves, updateLeavesStatus} from "@/core/services/leaveService.ts";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {LeaveStatus} from '@/core/types/enum.ts';
import {LeaveResponse} from '@/core/types/leave.ts';
import {PagedResponse} from '@/core/types/common.ts';
import {Eye} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge.tsx";
import {formatDurationRange} from "@/core/utils/date.ts";
import PageContent from "@/components/layout/PageContent.tsx";
import LeaveStatusUpdateDialog from "@/modules/leave/components/LeaveStatusUpdateDialog.tsx";
import PageHeader from "@/components/layout/PageHeader.tsx";
import PaginationComponent from "@/components/Pagination.tsx";
import UserAvatar from "@/modules/user/components/UserAvatar.tsx";
import LeaveDuration from "@/modules/leave/components/LeaveDuration.tsx";
import {UserContext} from "@/contexts/UserContext.tsx";

export default function LeavePage() {
    const [requestsList, setRequestsList] = useState<PagedResponse<LeaveResponse> | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [selectedRequest, setSelectedRequest] = useState<LeaveResponse | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const {user} = useContext(UserContext);

    // Fetch pending leave requests
    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const response = await getLeaves({status: LeaveStatus.PENDING}, currentPage);
                setRequestsList(response);
            } catch (error) {
                const errorMessage = getErrorMessage(error as Error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive"
                });
            }
        };

        fetchLeaves();
    }, [currentPage]);

    // View request details
    const handleRowClick = (request: LeaveResponse) => {
        setSelectedRequest(request);
    };

    // Handle leave request approval or rejection
    const handleRequest = async (status: LeaveStatus, id: number) => {
        try {
            setIsProcessing(true);
            await updateLeavesStatus({status}, id);

            setRequestsList(prevState => ({
                ...prevState,
                contents: prevState?.contents.filter(r => r.id !== id) || []
            }));

            toast({
                title: "Success",
                description: `Request ${status.toLowerCase()} successfully.`,
                variant: "default",
            });

        } catch (error) {
            const errorMessage = getErrorMessage(error as Error);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
            setSelectedRequest(null);
        }
    };

    return (
        <>
            <PageHeader title='Leaves'/>
            <PageContent>
                <Card className="flex flex-1 flex-col rounded-lg border shadow-sm p-4 gap-4">
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
                            {requestsList?.contents.length ? (
                                requestsList.contents.map((request) => (
                                    <RequestRowItem
                                        key={request.id}
                                        request={request}
                                        handleRowClick={() => handleRowClick(request)}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-gray-500">
                                        No pending requests found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {requestsList && requestsList.totalPages > 1 && (
                        <PaginationComponent
                            pageNumber={requestsList.pageNumber + 1}
                            setPageNumber={setCurrentPage}
                            totalPages={requestsList.totalPages}
                        />
                    )}
                </Card>

                {selectedRequest && (
                    <LeaveStatusUpdateDialog
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

// Request Row Component
type RequestItemProps = {
    request: LeaveResponse;
    handleRowClick: () => void;
};

function RequestRowItem({request, handleRowClick}: RequestItemProps) {
    const navigate = useNavigate();
    const durationText = formatDurationRange(request.duration, request.startAt, request.endAt);

    const viewEmployeeProfile = (id: number) => {
        navigate(`/users/${id}/`, {state: {from: "/requests"}});
    };

    return (
        <TableRow>
            <TableCell className="flex items-center gap-2 font-medium">
                <UserAvatar avatar={request.user?.avatar} avatarSize={32}/>
                <span
                    className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
                    onClick={() => viewEmployeeProfile(request.user.id)}
                >
                    {request.user.firstName} {request.user.lastName}
                </span>
            </TableCell>
            <TableCell>{request.user.team.name}</TableCell>
            <TableCell>
                <Badge variant="outline">{request.activatedType.name}</Badge>
            </TableCell>
            <TableCell>{durationText}</TableCell>
            <LeaveDuration duration={request.duration}/>
            <TableCell>
                <Button className="px-1" variant="outline" size="sm" onClick={handleRowClick}>
                    <Eye className="h-4 text-[#3b87f7]"/>
                </Button>
            </TableCell>
        </TableRow>
    );
}