import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/core/components";
import { Pencil, Trash } from "lucide-react";
import {LeaveTypeCreateRequest, LeaveTypeResponse} from "@/constants/types/leaveTypes";
import { getErrorMessage } from "@/utils/errorHandler";
import { toast } from "@/components/ui/use-toast";
import {createLeavesType, deleteLeaveType, getLeavesTypes, updateLeaveType} from "@/services/leaveService";
import {LeaveTypeCycleJson } from "@/constants/types/enums";
import {UpdateLeaveType} from "@/modules/Leaves/Components/UpdateLeaveType.tsx";
import {DeleteLeaveType} from "@/modules/Leaves/Components/DeleteLeaveType.tsx";
import {CreateLeaveType} from "@/modules/Leaves/Components/CreateLeaveType.tsx";

export default function LeaveType() {
    const [leaveTypeList, setLeaveTypeList] = useState<LeaveTypeResponse[]>([]);
    const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveTypeResponse | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const recordsPerPage = 5;

    // Fetch leave types
    useEffect(() => {
        getLeavesTypes()
            .then((response: LeaveTypeResponse[]) => setLeaveTypeList(response))
            .catch((error) => {
                const errorMessage = getErrorMessage(error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            });
    }, []);

    //Handles creating a leave type.
    const handleCreateLeaveType = (data: LeaveTypeCreateRequest) => {
        setIsProcessing(true);
        createLeavesType(data)
            .then((response) => {
                setLeaveTypeList((prevList) => [...prevList, response]);
                toast({
                    title: "Success",
                    description: "Leave type created successfully!",
                    variant: "default",
                });
            })
            .catch((error) => {
                const errorMessage = getErrorMessage(error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            })
            .finally(() => {
                setIsProcessing(false);
                setIsCreateDialogOpen(false);
            });
    };

    //Handles removing a leave type.
    const handleRemoveLeaveType = () => {
        if (selectedLeaveType) {
            setIsProcessing(true);
            deleteLeaveType(selectedLeaveType.id)
                .then(() => {
                    setLeaveTypeList((prev) => prev.filter((type) => type.id !== selectedLeaveType.id));
                    toast({
                        title: "Success",
                        description: "Leave type removed successfully!",
                        variant: "default",
                    });
                })
                .catch((error) => {
                    const errorMessage = getErrorMessage(error);
                    toast({
                        title: "Error",
                        description: errorMessage,
                        variant: "destructive",
                    });
                })
                .finally(() => {
                    setIsProcessing(false);
                    setSelectedLeaveType(null);
                    setIsDeleteDialogOpen(false);
                });
        }
    };

    //Handles updating a leave type.
    const handleUpdateLeaveType = (updatedLeaveType: LeaveTypeResponse) => {
        setIsProcessing(true);
        updateLeaveType({ name: updatedLeaveType.name, cycle: updatedLeaveType.cycle }, updatedLeaveType.id)
            .then((response) => {
                setLeaveTypeList((prev) => prev.map((type) => (type.id === response.id ? response : type)));
                toast({
                    title: "Success",
                    description: "Leave type updated successfully!",
                    variant: "default",
                });
            })
            .catch((error) => {
                const errorMessage = getErrorMessage(error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            })
            .finally(() => {
                setIsProcessing(false);
                setIsUpdateDialogOpen(false);
                setSelectedLeaveType(null);
            });
    };

    const paginatedLeaveTypeList = leaveTypeList.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    return (
        <>
            <div className="flex flex-wrap justify-between text-lg font-medium px-4 pt-4">
                <h1 className="text-lg font-semibold md:text-2xl">Leave Types</h1>
                <Button onClick={() => setIsCreateDialogOpen(true)}>Create</Button>
            </div>

            <main className="flex flex-1 flex-col p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Cycle</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedLeaveTypeList.map((leaveType) => (
                                <LeaveTypeRowItem
                                    key={leaveType.id}
                                    leaveType={leaveType}
                                    openDeleteDialog={() => {
                                        setSelectedLeaveType(leaveType);
                                        setIsDeleteDialogOpen(true);
                                    }}
                                    openUpdateDialog={() => {
                                        setSelectedLeaveType(leaveType);
                                        setIsUpdateDialogOpen(true);
                                    }}
                                    isProcessing={isProcessing}
                                />
                            ))}
                        </TableBody>
                    </Table>

                    {isCreateDialogOpen && (
                        <CreateLeaveType
                            isOpen={isCreateDialogOpen}
                            onClose={() => setIsCreateDialogOpen(false)}
                            onSubmit={handleCreateLeaveType}
                        />
                    )}

                    {isDeleteDialogOpen && selectedLeaveType && (
                        <DeleteLeaveType
                            leaveType={selectedLeaveType}
                            handleReject={() => setIsDeleteDialogOpen(false)}
                            handleAccept={handleRemoveLeaveType}
                        />
                    )}

                    {isUpdateDialogOpen && selectedLeaveType && (
                        <UpdateLeaveType
                            leaveType={selectedLeaveType}
                            handleUpdate={handleUpdateLeaveType}
                            handleClose={() => setIsUpdateDialogOpen(false)}
                        />
                    )}

                    {leaveTypeList.length > recordsPerPage && (
                        <Pagination
                            pageSize={recordsPerPage}
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalContents={leaveTypeList.length}
                        />
                    )}
                </Card>
            </main>
        </>
    );
}

// Row Item Component for Leave Types
type LeaveTypeRowItemProps = {
    leaveType: LeaveTypeResponse;
    openDeleteDialog: () => void;
    openUpdateDialog: () => void;
    isProcessing: boolean;
};

function LeaveTypeRowItem({ leaveType, openDeleteDialog, openUpdateDialog, isProcessing }: LeaveTypeRowItemProps) {
    return (
        <TableRow>
            <TableCell>{leaveType.name}</TableCell>
            <TableCell>{LeaveTypeCycleJson[leaveType.cycle]}</TableCell>
            <TableCell className="text-right">
                <div className="flex gap-4 justify-end">
                    <Button
                        className="px-1"
                        variant="outline"
                        size="sm"
                        onClick={openUpdateDialog}
                        disabled={isProcessing}
                    >
                        <Pencil className="h-4" />
                    </Button>
                    <Button
                        className="px-1"
                        variant="outline"
                        size="sm"
                        onClick={openDeleteDialog}
                        disabled={isProcessing}
                    >
                        <Trash className="h-4 text-[#ef4444]" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}