import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Pencil, Plus, Trash} from "lucide-react";
import {toast} from "@/components/ui/use-toast";
import {LeaveTypeUpdateDialog} from "@/modules/leave/components/LeaveTypeUpdateDialog.tsx";
import {DeleteDialog} from "@/modules/leave/components/DeleteDialog.tsx";
import {LeaveTypeCreateDialog} from "@/modules/leave/components/LeaveTypeCreateDialog.tsx";
import {PageSection} from "@/components/layout/PageSection.tsx";
import {createLeavesType, deleteLeaveType, getLeavesTypes, updateLeaveType} from "@/core/services/leaveService";
import {LeaveTypeCreateRequest, LeaveTypeResponse} from "@/core/types/leave.ts";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {LeaveTypeCycleJson} from "@/core/types/enum.ts";

export default function LeaveTypeList() {
    const [leaveTypeList, setLeaveTypeList] = useState<LeaveTypeResponse[]>([]);
    const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveTypeResponse | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
                    description: "leave type created successfully!",
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
                        description: "leave type removed successfully!",
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
        updateLeaveType({name: updatedLeaveType.name, cycle: updatedLeaveType.cycle}, updatedLeaveType.id)
            .then((response) => {
                setLeaveTypeList((prev) => prev.map((type) => (type.id === response.id ? response : type)));
                toast({
                    title: "Success",
                    description: "leave type updated successfully!",
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

    return (
        <>
            <PageSection title='Leave Types' description={"Create and manage leave types"}>
                <Button onClick={() => setIsCreateDialogOpen(true)} className='px-2 h-9'>
                    <Plus className="h-4 w-4 mr-1"/>
                    Create
                </Button>
            </PageSection>
            <Card className="flex flex-1 flex-col   p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Cycle</TableHead>
                            <TableHead>Requires Approval</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaveTypeList.map((leaveType) => (
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
                    <LeaveTypeCreateDialog
                        isOpen={isCreateDialogOpen}
                        onClose={() => setIsCreateDialogOpen(false)}
                        onSubmit={handleCreateLeaveType}
                    />
                )}

                {isDeleteDialogOpen && selectedLeaveType && (
                    <DeleteDialog
                        name="Leave Type"
                        label={selectedLeaveType.name}
                        handleReject={() => setIsDeleteDialogOpen(false)}
                        handleAccept={handleRemoveLeaveType}
                    />
                )}

                {isUpdateDialogOpen && selectedLeaveType && (
                    <LeaveTypeUpdateDialog
                        leaveType={selectedLeaveType}
                        handleUpdate={handleUpdateLeaveType}
                        handleClose={() => setIsUpdateDialogOpen(false)}
                    />
                )}
            </Card>
        </>
    );
}

// Row Item Component for leave Types
type LeaveTypeRowItemProps = {
    leaveType: LeaveTypeResponse;
    openDeleteDialog: () => void;
    openUpdateDialog: () => void;
    isProcessing: boolean;
};

function LeaveTypeRowItem({leaveType, openDeleteDialog, openUpdateDialog, isProcessing}: LeaveTypeRowItemProps) {
    const isArchived = leaveType.status === 'ARCHIVED';

    return (
        <TableRow className={isArchived ? 'opacity-50' : ''}>
            <TableCell>{leaveType.name} {leaveType.symbol}</TableCell>
            <TableCell>{leaveType.amount}</TableCell>
            <TableCell>{LeaveTypeCycleJson[leaveType.cycle]}</TableCell>
            <TableCell>{leaveType.requiresApproval ? "Yes" : "No"}</TableCell>
            <TableCell className="text-right">
                {!isArchived ? (
                    <div className="flex gap-4 justify-end">
                        <Button
                            className="px-1"
                            variant="outline"
                            size="sm"
                            onClick={openUpdateDialog}
                            disabled={isProcessing}
                        >
                            <Pencil className="h-4"/>
                        </Button>
                        <Button
                            className="px-1"
                            variant="outline"
                            size="sm"
                            onClick={openDeleteDialog}
                            disabled={isProcessing}
                        >
                            <Trash className="h-4 text-[#ef4444]"/>
                        </Button>
                    </div>
                ) : (
                    <span className="text-sm text-gray-500">Archived</span>
                )}
            </TableCell>
        </TableRow>
    );
}