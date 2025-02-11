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
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {activatedTypes.map((activatedType, index) => {
                    const leaveType = leaveTypes.find(type => type.id === activatedType.typeId);

                    return (
                        <TableRow key={index}>
                            <TableCell>{leaveType?.name || "Unknown"} {leaveType.symbol}</TableCell>
                            <TableCell>{activatedType.amount}</TableCell>
                            <TableCell>{activatedType.requiresApproval ? "Yes" : "No"}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setEditingIndex(index);
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const types = form.getValues("activatedTypes");
                                            types.splice(index, 1);
                                            form.setValue("activatedTypes", [...types]);
                                        }}
                                    >
                                        <Trash className="h-4 w-4 text-destructive" />
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
                        <TableCell colSpan={4} className="text-center">This leave policy doesn't have any details yet. Please click the{" "}<strong>+</strong> button above to add new details.</TableCell>
                    </TableRow>
                </TableFooter>
            )}
        </Table>
    );
}