import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Pencil, Plus, Trash} from "lucide-react";
import {toast} from "@/components/ui/use-toast";
import {PageSection} from "@/components/layout/PageSection";
import {createLeavesType, deleteLeaveType, getLeavesTypes, updateLeaveType} from "@/core/services/leaveService";
import {LeaveTypeCreateRequest, LeaveTypeResponse, LeaveTypeUpdateRequest} from "@/core/types/leave";
import {getErrorMessage} from "@/core/utils/errorHandler";
import {LeaveTypeCycleJson} from "@/core/types/enum";
import {LeaveTypeDialog} from "@/modules/leave/components/LeaveTypeDialog.tsx";

export default function LeaveTypeList() {
    const [leaveTypeList, setLeaveTypeList] = useState<LeaveTypeResponse[]>([]);
    const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveTypeResponse | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    // Fetch leave types
    useEffect(() => {
        getLeavesTypes()
            .then((response: LeaveTypeResponse[]) => setLeaveTypeList(response))
            .catch((error) => {
                const errorMessage = getErrorMessage(error);
                toast({title: "Error", description: errorMessage, variant: "destructive",});
            });
    }, []);

    const handleUpdateLeaveType = (data: LeaveTypeUpdateRequest, id: number) => {
        updateLeaveType(data, id)
            .then((response) => {
                setLeaveTypeList((prevList) =>
                    prevList.map((type) => (type.id === id ? response : type))
                );
                toast({title: "Success", description: "Leave type updated successfully!"});
            })
            .catch((error) => {
                toast({title: "Error", description: getErrorMessage(error), variant: "destructive"});
            })
            .finally(() => {
                setIsDialogOpen(false);
            });
    };

    const handleCreateLeaveType = (data: LeaveTypeCreateRequest) => {
        createLeavesType(data)
            .then((response) => {
                setLeaveTypeList((prevList) => [...prevList, response]);
                toast({title: "Success", description: "Leave type created successfully!"});
            })
            .catch((error) => {
                toast({title: "Error", description: getErrorMessage(error), variant: "destructive"});
            })
            .finally(() => {
                setIsDialogOpen(false);
            });
    };

    const handleRemoveLeaveType = () => {
        if (selectedLeaveType) {
            deleteLeaveType(selectedLeaveType.id)
                .then(() => {
                    setLeaveTypeList((prev) => prev.filter((type) => type.id !== selectedLeaveType.id));
                    toast({title: "Success", description: "Leave type removed successfully!", variant: "default",});
                })
                .catch((error) => {
                    const errorMessage = getErrorMessage(error);
                    toast({title: "Error", description: errorMessage, variant: "destructive",});
                })
                .finally(() => {
                    setSelectedLeaveType(null);
                    setIsDialogOpen(false);
                });
        }
    };

    return (
        <>
            <PageSection title='Leave Types' description={'Create and manage leave types'}>
                <Button onClick={() => {
                    setIsUpdateMode(false);
                    setSelectedLeaveType(null);
                    setIsDialogOpen(true);
                }}
                        className='px-2 h-9'
                >
                    <Plus className="h-4 w-4 mr-1"/>
                    Create
                </Button>
            </PageSection>

            <Card className="flex flex-1 flex-col p-4">
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
                                openDialog={() => {
                                    setSelectedLeaveType(leaveType);
                                    setIsUpdateMode(true);
                                    setIsDialogOpen(true);
                                }}
                                handleDelete={() => {
                                    setSelectedLeaveType(leaveType);
                                    handleRemoveLeaveType();
                                }}
                            />
                        ))}
                    </TableBody>
                </Table>

                {isDialogOpen && (
                    <LeaveTypeDialog
                        isOpen={isDialogOpen}
                        onClose={() => {
                            setIsDialogOpen(false);
                            setSelectedLeaveType(null);
                        }}
                        isUpdateMode={isUpdateMode}
                        initialData={isUpdateMode ? selectedLeaveType : null}
                        onSubmit={(data) => {
                            if (isUpdateMode && selectedLeaveType?.id) {
                                handleUpdateLeaveType(data as LeaveTypeUpdateRequest, selectedLeaveType.id);
                            } else {
                                handleCreateLeaveType(data as LeaveTypeCreateRequest);
                            }
                        }}
                    />
                )}
            </Card>
        </>
    );
}

type LeaveTypeRowItemProps = {
    leaveType: LeaveTypeResponse;
    openDialog: () => void;
    handleDelete: () => void;
};

function LeaveTypeRowItem({leaveType, openDialog, handleDelete}: LeaveTypeRowItemProps) {
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
                            onClick={openDialog}
                        >
                            <Pencil className="h-4"/>
                        </Button>
                        <Button
                            className="px-1"
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
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