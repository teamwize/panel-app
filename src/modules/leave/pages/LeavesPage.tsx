import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Card} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {getLeaves, updateLeavesStatus} from "@/core/services/leaveService.ts";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {LeaveStatus} from '@/core/types/enum.ts';
import {GetLeavesFilter, LeaveResponse} from '@/core/types/leave.ts';
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
import LeaveFilterForm from "@/modules/leave/components/LeaveFilterForm.tsx";
import {UserResponse} from "@/core/types/user.ts";
import {getUsers} from "@/core/services/userService.ts";
import {getTeams} from "@/core/services/teamService.ts";
import {TeamResponse} from "@/core/types/team.ts";

export default function LeavesPage() {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [selectedLeave, setSelectedLeave] = useState<LeaveResponse | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [filters, setFilters] = useState<GetLeavesFilter>({status: LeaveStatus.PENDING});
    const [usersList, setUsersList] = useState<PagedResponse<UserResponse> | null>(null);
    const [teamList, setTeamList] = useState<TeamResponse[]>([]);
    const [leaves, setLeaves] = useState<PagedResponse<LeaveResponse> | null>(null);

    const fetchUsers = async () => {
        try {
            const response = await getUsers(currentPage);
            setUsersList(response);
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        }
    }

    const fetchTeams = async () => {
        try {
            const response = await getTeams();
            setTeamList(response);
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    const fetchLeaves = async () => {
        try {
            const response = await getLeaves(filters, currentPage);
            setLeaves(response);
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        }
    }

    const handleLeavesFilter = (newFilters: GetLeavesFilter) => {
        setFilters(prevFilters => ({...prevFilters, ...newFilters}));
        setCurrentPage(0);
    };

    // Fetch pending leave requests
    useEffect(() => {
        fetchUsers();
        fetchLeaves();
        fetchTeams();
    }, [currentPage, filters]);

    // View request details
    const handleRowClick = (request: LeaveResponse) => {
        setSelectedLeave(request);
    };

    // Handle leave request approval or rejection
    const handleRequest = async (status: LeaveStatus, id: number) => {
        try {
            setIsProcessing(true);
            await updateLeavesStatus({status}, id);
            toast({
                title: "Success",
                description: `Request ${status.toLowerCase()} successfully.`,
                variant: "default",
            });
            fetchLeaves();
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
            setSelectedLeave(null);
        }
    };

    return (
        <>
            <PageHeader title='Leaves'/>
            <PageContent>
                <LeaveFilterForm usersList={usersList} teamList={teamList} onFilter={handleLeavesFilter}/>
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
                            {leaves?.contents.length ? (
                                leaves.contents.map((request) => (
                                    <LeaveRow
                                        key={request.id}
                                        leave={request}
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

                    {leaves && leaves.totalPages > 1 && (
                        <PaginationComponent
                            pageNumber={leaves.pageNumber + 1}
                            setPageNumber={setCurrentPage}
                            totalPages={leaves.totalPages}
                        />
                    )}
                </Card>

                {selectedLeave && (
                    <LeaveStatusUpdateDialog
                        selectedRequest={selectedLeave}
                        toggleModal={() => setSelectedLeave(null)}
                        handleRequest={handleRequest}
                        isProcessing={isProcessing}
                    />
                )}
            </PageContent>
        </>
    );
}

// Request Row Component
type LeaveRowProps = {
    leave: LeaveResponse;
    handleRowClick: () => void;
};

function LeaveRow({leave, handleRowClick}: LeaveRowProps) {
    const navigate = useNavigate();
    const durationText = formatDurationRange(leave.duration, leave.startAt, leave.endAt);

    const viewEmployeeProfile = (id: number) => {
        navigate(`/users/${id}/`, {state: {from: "/requests"}});
    };

    return (
        <TableRow>
            <TableCell className="flex items-center gap-2 font-medium">
                <UserAvatar avatar={leave.user?.avatar} avatarSize={32}/>
                <span
                    className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
                    onClick={() => viewEmployeeProfile(leave.user.id)}
                >
                    {leave.user.firstName} {leave.user.lastName}
                </span>
            </TableCell>
            <TableCell>{leave.user.team.name}</TableCell>
            <TableCell>
                <Badge variant="outline">{leave.activatedType.name}</Badge>
            </TableCell>
            <TableCell>{durationText}</TableCell>
            <LeaveDuration duration={leave.duration}/>
            <TableCell>
                <Button className="px-1" variant="outline" size="sm" onClick={handleRowClick}>
                    <Eye className="h-4 text-[#3b87f7]"/>
                </Button>
            </TableCell>
        </TableRow>
    );
}