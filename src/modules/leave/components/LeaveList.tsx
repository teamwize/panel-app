import {Card} from "@/components/ui/card.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import React from "react";
import {LeaveResponse} from "@/core/types/leave.ts";
import PaginationComponent from "@/components/Pagination.tsx";
import {formatDurationRange} from "@/core/utils/date.ts";
import LeaveDuration from "@/modules/leave/components/LeaveDuration.tsx";
import LeaveStatusBadge from "@/modules/leave/components/LeaveStatusBadge.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {PagedResponse} from "@/core/types/common.ts";

type LeaveRequestListProps = {
    leaveRequests: PagedResponse<LeaveResponse>;
    setCurrentPage: (page: number) => void;
}

export default function LeaveList({leaveRequests, setCurrentPage}: LeaveRequestListProps) {
    return (
        <Card className="border-0 shadow-amber-50">
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
                        {leaveRequests.totalContents > 0 ? (
                            leaveRequests.contents.map((request) => (
                                <LeaveListItem request={request} key={request?.id}/>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">There is no pending request</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

            {leaveRequests && leaveRequests.totalPages > 1 && (
                <div className='mx-6 bordet-t'>
                    <PaginationComponent
                        pageNumber={leaveRequests.pageNumber + 1}
                        setPageNumber={setCurrentPage}
                        totalPages={leaveRequests.totalPages}
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
            <LeaveDuration duration={request.duration}/>
            <TableCell>
                <LeaveStatusBadge status={request.status}/>
            </TableCell>
            <TableCell>
                <Badge variant="outline">{request.activatedType.name} {request.activatedType.symbol}</Badge>
            </TableCell>
        </TableRow>
    );
}