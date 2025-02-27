import {LeavePolicyActivatedTypeResponse} from "@/core/types/leave.ts";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Pencil, Trash} from "lucide-react";
import React from "react";

type LeavePolicyTableProps = {
    activatedTypes: LeavePolicyActivatedTypeResponse[];
    onEdit: (type: LeavePolicyActivatedTypeResponse) => void;
    onRemove: (id: number) => void;
};

export function LeavePolicyTable({onEdit, activatedTypes, onRemove}: LeavePolicyTableProps) {
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
                {activatedTypes?.map((activatedType) => {
                    return (
                        <TableRow key={activatedType.typeId}>
                            <TableCell>{activatedType?.name || "Unknown"} {activatedType.symbol}</TableCell>
                            <TableCell>{activatedType.amount}</TableCell>
                            <TableCell>{activatedType.requiresApproval ? "Yes" : "No"}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        className="px-1 hover:bg-muted/80 transition-colors"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            onEdit(activatedType);
                                        }}
                                    >
                                        <Pencil className="h-4 text-muted-foreground"/>
                                    </Button>
                                    <Button
                                        className="px-1 hover:bg-red-50 transition-colors"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            onRemove(activatedType.typeId);
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