import {LeaveTypeResponse} from "@/core/types/leave.ts";
import {UseFormReturn} from "react-hook-form";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Pencil, Trash} from "lucide-react";
import React from "react";
import {FormInputs} from "@/modules/leave/pages/LeavePolicyUpdatePage.tsx";

type LeavePolicyTableProps = {
    leaveTypes: LeaveTypeResponse[];
    form: UseFormReturn<FormInputs>;
    setEditingIndex: (index: number) => void;
    setIsDialogOpen: (isOpen: boolean) => void;
};

export function LeavePolicyTable({ form, leaveTypes, setEditingIndex, setIsDialogOpen }: LeavePolicyTableProps) {
    const activatedTypes = form.watch("activatedTypes");

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Requires Approval</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {activatedTypes.map((activatedType, index) => {
                    const leaveType = leaveTypes.find(type => type.id === activatedType.typeId);

                    return (
                        <TableRow key={activatedType.typeId}>
                            <TableCell>{leaveType?.name || "Unknown"} {leaveType.symbol}</TableCell>
                            <TableCell>{activatedType.amount}</TableCell>
                            <TableCell>{activatedType.requiresApproval ? "Yes" : "No"}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        className="px-1 hover:bg-muted/80 transition-colors"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setEditingIndex(index);
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        <Pencil className="h-4 text-muted-foreground"/>
                                    </Button>
                                    <Button
                                        className="px-1 hover:bg-red-50 transition-colors"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            const types = form.getValues("activatedTypes");
                                            types.splice(index, 1);
                                            form.setValue("activatedTypes", [...types]);
                                        }}
                                    >
                                        <Trash className="h-4 text-red-500"/>
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>

            {activatedTypes.length === 0 && (
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">This leave policy doesn't have any leave types
                            yet. Please click the button above to add a leave type.</TableCell>
                    </TableRow>
                </TableFooter>
            )}
        </Table>
    );
}