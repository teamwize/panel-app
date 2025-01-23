import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Form} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Check, Pencil, PlusIcon} from "lucide-react";
import {toast} from "@/components/ui/use-toast";
import {getLeavesPolicies, getLeavesTypes, updateLeavePolicy,} from "@/services/leaveService";
import ActivateLeaveTypeDialog from "@/modules/Leaves/Components/ActivateLeaveTypeDialog";
import {LeavePolicyResponse, LeavePolicyStatus, LeaveTypeResponse} from "@/constants/types/leaveTypes";
import {getErrorMessage} from "@/utils/errorHandler";
import {LeavePolicyTable} from "@/modules/Leaves/Components/LeavePolicyTable.tsx";
import PageContent from "@/core/components/PageContent.tsx";
import {PageHeader} from "@/core/components";

export const LeaveTypeSchema = z.object({
    typeId: z.number({ required_error: "Leave type is required." }),
    amount: z.number().min(1, { message: "Amount must be at least 1." }),
    requiresApproval: z.boolean(),
});

const FormSchema = z.object({
    policyName: z.string().min(1, { message: "Policy name is required" }),
    activatedTypes: z.array(
        z.object({
            typeId: z.number(),
            amount: z.number().min(1),
            requiresApproval: z.boolean(),
        })
    ),
});

export type FormInputs = z.infer<typeof FormSchema>;

export default function UpdateLeavePolicy() {
    const {id} = useParams();
    const [leavePolicy, setLeavePolicy] = useState<LeavePolicyResponse | null>(null);
    const [leaveTypes, setLeaveTypes] = useState<LeaveTypeResponse[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const navigate = useNavigate();

    const form = useForm<FormInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            policyName: "",
            activatedTypes: [],
        },
    });

    const {reset, watch, setValue, handleSubmit} = form;

    // Fetch Existing Leave Policy and Update Form
    useEffect(() => {
        const fetchLeavePolicy = async () => {
            try {
                const fetchLeavePolicies = await getLeavesPolicies();
                const existingLeavePolicy = fetchLeavePolicies.find((policy) => policy.id === Number(id));

                if (existingLeavePolicy) {
                    setLeavePolicy(existingLeavePolicy);
                    reset({
                        policyName: existingLeavePolicy.name,
                        activatedTypes: existingLeavePolicy.activatedTypes.map((type) => ({
                            typeId: type.type.id,
                            amount: type.amount,
                            requiresApproval: type.requiresApproval,
                        })),
                    });
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: getErrorMessage(error as Error | string),
                    variant: "destructive",
                });
            }
        };

        fetchLeavePolicy();
    }, [id, reset]);

    // Fetch Leave Types
    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const types = await getLeavesTypes();
                setLeaveTypes(types);
            } catch (error) {
                toast({
                    title: "Error",
                    description: getErrorMessage(error as Error),
                    variant: "destructive",
                });
            }
        };

        fetchLeaveTypes();
    }, []);

    const savePolicyName = () => {
        const policyName = watch("policyName");
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
        const types = watch("activatedTypes");
        if (index !== null) {
            types[index] = newType;
        } else {
            types.push(newType);
        }
        setValue("activatedTypes", types);
        setIsDialogOpen(false);
        setEditingIndex(null);
    };

    const onSubmit = async (data: FormInputs) => {
        if (!leavePolicy) return;

        try {
            const formattedActivatedTypes = data.activatedTypes.map((type) => ({
                typeId: type.typeId,
                amount: type.amount,
                requiresApproval: type.requiresApproval,
            }));

            await updateLeavePolicy(
                {
                    name: data.policyName,
                    activatedTypes: formattedActivatedTypes,
                    status: LeavePolicyStatus.ACTIVE,
                },
                leavePolicy.id
            );

            toast({
                title: "Success",
                description: "Leave policy updated successfully",
                variant: "default",
            });

            navigate("/leaves");
        } catch (error) {
            toast({
                title: "Error",
                description: getErrorMessage(error as Error | string),
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <PageHeader title={`Update Leave Policy`} backButton="/leaves">
                <Button className="flex items-center space-x-1" onClick={() => setIsDialogOpen(true)}>
                    <PlusIcon className="h-5 w-5"/>
                </Button>
            </PageHeader>

            <PageContent>
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {isEditingName ? (
                                <CardHeader className="px-4 py-0 flex flex-row items-center space-y-0">
                                    <Input
                                        defaultValue={watch("policyName")}
                                        onChange={(e) => setValue("policyName", e.target.value)}
                                        placeholder="Enter policy name"
                                        className="flex-1"
                                    />
                                    <Button
                                        className="ml-2 py-0 px-2 mt-0"
                                        variant="outline"
                                        size="sm"
                                        onClick={savePolicyName}
                                    >
                                        <Check className="h-4 w-4"/>
                                    </Button>
                                </CardHeader>
                            ) : (
                                <CardHeader className="px-4 py-0">
                                    <CardTitle className="text-xl">
                                        {watch("policyName")}
                                        <Button
                                            className="ml-2 py-0 px-2"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsEditingName(true)}
                                        >
                                            <Pencil className="h-4 w-4"/>
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                            )}

                            <LeavePolicyTable
                                form={form}
                                leaveTypes={leaveTypes}
                                setEditingIndex={setEditingIndex}
                                setIsDialogOpen={setIsDialogOpen}
                            />

                            {watch("activatedTypes").length > 0 && (
                                <Button type="submit" className="w-fit mt-4">
                                    Save
                                </Button>
                            )}
                        </form>
                    </Form>
                </Card>
            </PageContent>

            <ActivateLeaveTypeDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setEditingIndex(null);
                }}
                leaveTypes={leaveTypes}
                onSave={(newType) => saveActivatedTypes(newType, editingIndex)}
                defaultValues={editingIndex !== null ? watch("activatedTypes")[editingIndex] : undefined}
                schema={LeaveTypeSchema}
            />
        </>
    );
}