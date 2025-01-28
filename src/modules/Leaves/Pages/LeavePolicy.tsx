import React, {useEffect, useState} from "react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {PageHeader, Pagination} from "@/core/components";
import {createLeavesPolicy, deleteLeavePolicy, getLeavesPolicies} from "@/services/leaveService";
import {LeavePolicyResponse, LeavePolicyStatus} from "@/constants/types/leaveTypes";
import {getErrorMessage} from "@/utils/errorHandler";
import {toast} from "@/components/ui/use-toast";
import {DeleteDialog} from "@/modules/Leaves/Components/DeleteDialog";
import {Pencil, Trash} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {CreatePolicyDialog} from "@/modules/Leaves/Components/CreateLeavePolicy";
import {NavigateFunction, useNavigate} from "react-router-dom";
import PageContent from "@/core/components/PageContent";

export default function LeavePolicy() {
    const [leavePolicyList, setLeavePolicyList] = useState<LeavePolicyResponse[]>([]);
    const [selectedLeavePolicy, setSelectedLeavePolicy] = useState<LeavePolicyResponse | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage = 10;
    const navigate = useNavigate();

    // Fetch leave policies
    useEffect(() => {
        const fetchLeavePolicies = async () => {
            try {
                const policies = await getLeavesPolicies();
                setLeavePolicyList(policies);
            } catch (error) {
                toast({
                    title: "Error",
                    description: getErrorMessage(error as Error),
                    variant: "destructive",
                });
            }
        };

        fetchLeavePolicies();
    }, []);

    const createLeavePolicy = async (name: string) => {
        try {
            setIsProcessing(true);
            setIsCreateDialogOpen(false);

            await createLeavesPolicy({
                name: name,
                status: LeavePolicyStatus.ACTIVE,
                activatedTypes: [],
            });

            toast({
                title: "Success",
                description: "Leave policy created successfully!",
                variant: "default",
            });

            // Refresh leave policies after creation
            const updatedPolicies = await getLeavesPolicies();
            setLeavePolicyList(updatedPolicies);

            // Navigate to the created policy
            const newPolicy = updatedPolicies.find((policy) => policy.name === name);
            if (newPolicy) {
                navigate(`/leaves/policy/${newPolicy.id}`);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: getErrorMessage(error as Error),
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRemoveLeavePolicy = async () => {
        if (!selectedLeavePolicy) return;

        try {
            setIsProcessing(true);

            await deleteLeavePolicy(selectedLeavePolicy.id);

            // Update the policy list locally
            setLeavePolicyList((prev) => prev.filter((policy) => policy.id !== selectedLeavePolicy.id));

            toast({
                title: "Success",
                description: "Leave policy removed successfully!",
                variant: "default",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: getErrorMessage(error as Error),
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
            setSelectedLeavePolicy(null);
            setIsDeleteDialogOpen(false);
        }
    };

    const paginatedLeavePolicyList = leavePolicyList.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    return (
        <>
            <PageHeader title="Leave Policy">
                <Button className="px-2 h-9" onClick={() => setIsCreateDialogOpen(true)}>
                    Create
                </Button>
            </PageHeader>

            <PageContent>
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

                    {isCreateDialogOpen && (
                        <CreatePolicyDialog
                            onClose={() => setIsCreateDialogOpen(false)}
                            onSubmit={(name) => createLeavePolicy(name)}
                        />
                    )}

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
            </PageContent>
        </>
    );
}

// Row Item Component for Leave Types
type LeavePolicyRowItemProps = {
    leavePolicy: LeavePolicyResponse;
    setSelectedLeavePolicy: (leavePolicy: LeavePolicyResponse | null) => void;
    setIsDeleteDialogOpen: (isOpen: boolean) => void;
    isProcessing: boolean;
    navigate: NavigateFunction;
};

function LeavePolicyRowItem({
                                navigate,
                                leavePolicy,
                                setSelectedLeavePolicy,
                                setIsDeleteDialogOpen,
                                isProcessing,
                            }: LeavePolicyRowItemProps) {
    return (
        <TableRow key={leavePolicy.id}>
            <TableCell>{leavePolicy.name}</TableCell>
            <TableCell>
                <div className="flex flex-wrap gap-2">
                    {leavePolicy.activatedTypes.map((activatedType) => (
                        <Badge key={activatedType.typeId} variant="outline">
                            {activatedType.name}: {activatedType.amount}
                        </Badge>
                    ))}
                </div>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex gap-4 justify-end">
                    <Button
                        className="px-1"
                        variant="outline"
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => navigate(`/leaves/policy/${leavePolicy.id}`, {state: {leavePolicy}})}
                    >
                        <Pencil className="h-4"/>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="px-1"
                        disabled={isProcessing}
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