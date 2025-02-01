import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import React, {useState} from "react";
import {LeaveResponse} from "@/core/types/leave.ts";
import PaginationComponent from "@/components/Pagination.tsx";
import {formatDurationRange} from "@/core/utils/date.ts";
import LeaveDuration from "@/modules/leave/components/LeaveDuration.tsx";
import LeaveStatusBadge from "@/modules/leave/components/LeaveStatusBadge.tsx";
import {Badge} from "@/components/ui/badge.tsx";

type LeaveRequestListProps = {
    leaveRequests: LeaveResponse[];

}

export default function LeaveList({leaveRequests}: LeaveRequestListProps) {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage: number = 5;

    return (
        <Card x-chunk="dashboard-05-chunk-3" className="border-0 shadow-amber-50">
            <CardHeader className="py-4 px-0">
                <CardTitle className="text-xl">My Leaves ({leaveRequests.length})</CardTitle>
            </CardHeader>

            <CardContent className='p-0'>
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
                                    <LeaveListItem request={request} key={request?.id}/>
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
                    <PaginationComponent
                        pageSize={recordsPerPage}
                        pageNumber={currentPage}
                        setPageNumber={setCurrentPage}
                        totalContents={leaveRequests.length}
                    />
                </div>
            )}
        </Card>
    )
}

type LeaveRequestTableProps = {
    request: LeaveResponse;
}

function LeaveListItem({request}: LeaveRequestTableProps) {
    const durationText = formatDurationRange(request.duration, request.startAt, request.endAt);

    return (
        <TableRow>
            <TableCell>{durationText}</TableCell>
            <LeaveDuration request={request}/>
            <TableCell>
                <LeaveStatusBadge status={request.status}/>
            </TableCell>
            <TableCell>
                <Badge variant="outline">{request.activatedType.name}</Badge>
            </TableCell>
        </TableRow>
    );
}