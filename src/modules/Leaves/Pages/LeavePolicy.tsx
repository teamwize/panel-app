import React, {useEffect, useState} from "react";
import {Card} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {PageTitle, Pagination} from "@/core/components";
import {deleteLeavePolicy, getLeavesPolicies} from "@/services/leaveService.ts";
import {LeavePolicyResponse} from "@/constants/types/leaveTypes.ts";
import {getErrorMessage} from "@/utils/errorHandler.ts";
import {toast} from "@/components/ui/use-toast.ts";
import {DeleteDialog} from "@/modules/Leaves/Components/DeleteDialog.tsx";
import {Pencil, Trash} from "lucide-react";
import {Badge} from "@/components/ui/badge"
import {CreatePolicyDialog} from "@/modules/Leaves/Components/CreateLeavePolicy.tsx";
import {NavigateFunction, useNavigate} from "react-router-dom";

export default function LeavePolicy() {
    const [leavePolicyList, setLeavePolicyList] = useState<LeavePolicyResponse[]>([]);
    const [selectedLeavePolicy, setSelectedLeavePolicy] = useState<LeavePolicyResponse | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage = 5;

    // Fetch leave policies
    useEffect(() => {
        getLeavesPolicies()
            .then((response) => setLeavePolicyList(response))
            .catch((error) => {
                toast({
                    title: "Error",
                    description: getErrorMessage(error),
                    variant: "destructive",
                });
            });
    }, []);

    // Handles removing a leave policy.
    const handleRemoveLeavePolicy = () => {
        if (selectedLeavePolicy) {
            setIsProcessing(true);
            deleteLeavePolicy(selectedLeavePolicy.id)
                .then(() => {
                    setLeavePolicyList((prev) => prev.filter((policy) => policy.id !== selectedLeavePolicy.id));
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
                    setSelectedLeavePolicy(null);
                    setIsDeleteDialogOpen(false);
                });
        }
    };

    const paginatedLeavePolicyList = leavePolicyList.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    return (
        <>
            <PageTitle title="Leave Policy">
                <Button onClick={() => setIsCreateDialogOpen(true)}>Create</Button>
            </PageTitle>

            <main className="flex flex-1 flex-col p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Types</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedLeavePolicyList.map((leavePolicy) => (
                                <LeavePolicyRowItem
                                    key={leavePolicy.id}
                                    leavePolicy={leavePolicy}
                                    setSelectedLeavePolicy={setSelectedLeavePolicy}
                                    setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                                    isProcessing={isProcessing}
                                    navigate={navigate}
                                />
                            ))}
                        </TableBody>
                    </Table>

                    {isCreateDialogOpen &&
                        <CreatePolicyDialog
                            onClose={() => setIsCreateDialogOpen(false)}
                            onSubmit={(name) => {
                                setIsCreateDialogOpen(false);
                                navigate(`/leaves/policy/update?name=${name}`);
                            }}
                        />
                    }

                    {isDeleteDialogOpen && selectedLeavePolicy && (
                        <DeleteDialog
                            name="Leave Policy"
                            label={selectedLeavePolicy.name}
                            handleReject={() => setIsDeleteDialogOpen(false)}
                            handleAccept={handleRemoveLeavePolicy}
                        />
                    )}

                    {leavePolicyList.length > recordsPerPage && (
                        <Pagination
                            pageSize={recordsPerPage}
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalContents={leavePolicyList.length}
                        />
                    )}
                </Card>
            </main>
        </>
    )
}

// Row Item Component for Leave Types
type LeavePolicyRowItemProps = {
    leavePolicy: LeavePolicyResponse;
    setSelectedLeavePolicy: (leavePolicy: LeavePolicyResponse | null) => void;
    setIsDeleteDialogOpen: (isOpen: boolean) => void;
    isProcessing: boolean;
    navigate: NavigateFunction
};

function LeavePolicyRowItem({ navigate, leavePolicy, setSelectedLeavePolicy, setIsDeleteDialogOpen, isProcessing }: LeavePolicyRowItemProps) {
    return (
        <TableRow key={leavePolicy.id}>
            <TableCell>{leavePolicy.name}</TableCell>
            <TableCell>
                <div className="flex flex-wrap gap-2">
                    {leavePolicy.activatedTypes.map((activatedType) => (
                        <Badge key={activatedType.id} variant="outline">{activatedType.type.name}: {activatedType.amount}</Badge>
                    ))}
                </div>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex gap-4 justify-end">
                    <Button className="px-1" variant="outline" size="sm" disabled={isProcessing}
                            onClick={() => navigate(`/leaves/policy/update`, {state: { leavePolicy }})}                    >
                        <Pencil className="h-4"/>
                    </Button>
                    <Button variant="outline" size="sm" className="px-1" disabled={isProcessing}
                            onClick={() => {
                                setSelectedLeavePolicy(leavePolicy);
                                setIsDeleteDialogOpen(true);
                            }}
                    >
                        <Trash className="h-4 text-[#ef4444]" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}