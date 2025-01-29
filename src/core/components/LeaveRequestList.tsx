import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {LeaveRequestTable, Pagination} from "@/core/components/index.ts";
import React, {useState} from "react";
import {LeaveResponse} from "@/constants/types/leaveTypes.ts";

type LeaveRequestListProps = {
    leaveRequests: LeaveResponse[];

}

export default function LeaveRequestList({leaveRequests}: LeaveRequestListProps) {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage: number = 5;

    return (
        <Card x-chunk="dashboard-05-chunk-3" className="border-0 shadow-amber-50">
            <CardHeader className="py-4 px-0">
                <CardTitle className="text-xl">Leave Requests History ({leaveRequests.length})</CardTitle>
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
    )
}