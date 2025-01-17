import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {Check, ChevronLeft, Pencil, PlusIcon} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { createLeavesPolicy, getLeavesTypes } from "@/services/leaveService";
import ActivateLeaveTypeDialog from "@/modules/Leaves/Components/ActivateLeaveTypeDialog";
import { LeavePolicyResponse, LeaveTypeResponse } from "@/constants/types/leaveTypes";
import { getErrorMessage } from "@/utils/errorHandler";
import {LeavePolicyTable} from "@/modules/Leaves/Components/LeavePolicyTable.tsx";
import {usePageTitle} from "@/contexts/PageTitleContext.tsx";

export const LeaveTypeSchema = z.object({
    typeId: z.number({ required_error: "Leave type is required." }),
    amount: z.number().min(1, { message: "Amount must be at least 1." }),
    requiresApproval: z.boolean(),
});

const FormSchema = z.object({
    policyName: z.string().min(1, { message: "Policy name is required" }),
    activatedTypes: z.array(z.object({
        typeId: z.number(),
        amount: z.number().min(1),
        requiresApproval: z.boolean(),
    })),
});

export type FormInputs = z.infer<typeof FormSchema>;

export default function UpdateLeavePolicy() {
    const { state } = useLocation();
    const existingPolicy: LeavePolicyResponse = state?.leavePolicy;
    const [searchParams] = useSearchParams();
    const leavePolicyName = searchParams.get("name");
    const initialPolicyName = leavePolicyName || existingPolicy?.name || "";
    const isCreateMode = Boolean(leavePolicyName);
    const [leaveTypes, setLeaveTypes] = useState<LeaveTypeResponse[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const navigate = useNavigate();
    const { setTitle, setChildren } = usePageTitle();

    const form = useForm<FormInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            policyName: initialPolicyName,
            activatedTypes: existingPolicy?.activatedTypes.map(type => ({
                typeId: type.type.id,
                amount: type.amount,
                requiresApproval: type.requiresApproval,
            })) || [],
        },
    });

    useEffect(() => {
        setTitle(
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/leaves")}
                    className="p-0 hover:bg-transparent focus:ring-0"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                {isCreateMode ? `Update ${form.watch("policyName")} Leave Policy` : "Update Leave Policy"}
            </div>
        );

        setChildren(
            <Button className="flex items-center space-x-1" onClick={() => setIsDialogOpen(true)}>
                <PlusIcon className="h-5 w-5" />
            </Button>
        );
    }, [setTitle, setChildren, navigate, isCreateMode, form]);

    // Fetch leave types
    useEffect(() => {
        getLeavesTypes()
            .then(setLeaveTypes)
            .catch((error) => {
                toast({
                    title: "Error",
                    description: getErrorMessage(error),
                    variant: "destructive",
                });
            });
    }, []);

    const savePolicyName = () => {
        const policyName = form.watch("policyName");
        if (!policyName) {
            toast({
                title: "Error",
                description: "Policy name cannot be empty",
                variant: "destructive",
            });
            return;
        }
        setIsEditingName(false);
    };

    const saveActivatedTypes = (newType: z.infer<typeof LeaveTypeSchema>, index: number | null) => {
        const types = form.getValues("activatedTypes");
        if (index !== null) {
            types[index] = newType;
        } else {
            types.push(newType);
        }
        form.setValue("activatedTypes", types);
        setIsDialogOpen(false);
        setEditingIndex(null);
    };

    const onSubmit = async (data: FormInputs) => {
        try {
            const sanitizedActivatedTypes = data.activatedTypes.map((type) => ({
                typeId: type.typeId || 0,
                amount: type.amount,
                requiresApproval: type.requiresApproval,
            }));

            await createLeavesPolicy({
                name: data.policyName,
                activatedTypes: sanitizedActivatedTypes,
            });

            toast({
                title: "Success",
                description: "Leave policy saved successfully",
                variant: "default"
            });
            navigate("/leaves");
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error | string);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {!isCreateMode && (
                                isEditingName ? (
                                    <CardHeader className="px-4 py-0 flex flex-row items-center space-y-0">
                                        <Input
                                            defaultValue={form.watch("policyName")}
                                            onChange={(e) => form.setValue("policyName", e.target.value)}
                                            placeholder="Enter policy name"
                                            className="flex-1"
                                        />
                                        <Button className='ml-2 py-0 px-2 mt-0' variant="outline" size="sm" onClick={savePolicyName}>
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    </CardHeader>
                                ) : (
                                    <CardHeader className="px-4 py-0">
                                        <CardTitle className="text-xl">
                                            {form.watch("policyName")}
                                            <Button className={'ml-2 py-0 px-2'} variant="outline" size="sm" onClick={() => setIsEditingName(true)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                )
                            )}

                            <LeavePolicyTable
                                form={form}
                                leaveTypes={leaveTypes}
                                setEditingIndex={setEditingIndex}
                                setIsDialogOpen={setIsDialogOpen}
                            />

                            {form.watch("activatedTypes").length > 0 && (
                                <Button type="submit" className="w-fit mt-4">Save</Button>
                            )}
                        </form>
                    </Form>
                </Card>
            </main>

            <ActivateLeaveTypeDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setEditingIndex(null);
                }}
                leaveTypes={leaveTypes}
                onSave={(newType) => saveActivatedTypes(newType, editingIndex)}
                defaultValues={editingIndex !== null ? form.getValues("activatedTypes")[editingIndex] : undefined}
                schema={LeaveTypeSchema}
            />
        </>
    );
}