import React, {useEffect} from "react";
import {z} from "zod";
import {useForm, UseFormReturn} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FormInputs, LeaveTypeSchema} from "@/modules/leave/pages/LeavePolicyUpdatePage.tsx";
import {LeaveTypeResponse} from "@/core/types/leave.ts";
import {Save, X} from "lucide-react";

type ActivateLeaveTypeDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    leaveTypes: LeaveTypeResponse[];
    onSave: (data: z.infer<typeof LeaveTypeSchema>) => void;
    schema: typeof LeaveTypeSchema;
    defaultValues?: z.infer<typeof LeaveTypeSchema>;
    form: UseFormReturn<FormInputs>;
};

export default function LeavePolicyActivatedTypeCreateDialog({
                                                                 isOpen,
                                                                 onClose,
                                                                 leaveTypes,
                                                                 onSave,
                                                                 schema,
                                                                 defaultValues,
                                                                 form,
                                                             }: ActivateLeaveTypeDialogProps) {

    const dialogForm = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            typeId: undefined,
            amount: 1,
            requiresApproval: false,
        },
    });

    // Update form values when `defaultValues` changes
    useEffect(() => {
        if (defaultValues) {
            dialogForm.reset(defaultValues);
        }
    }, [defaultValues]);

    const handleSave = (data: z.infer<typeof schema>) => {
        onSave(data);
        dialogForm.reset({
            typeId: undefined,
            amount: 1,
            requiresApproval: false,
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Leave Type</DialogTitle>
                </DialogHeader>
                <Form {...dialogForm}>
                    <form onSubmit={dialogForm.handleSubmit(handleSave)} className="space-y-4">
                        <TypeIdField form={form} leaveTypes={leaveTypes} dialogForm={dialogForm}/>
                        <AmountField dialogForm={dialogForm}/>
                        <RequiresApprovalField dialogForm={dialogForm}/>
                        <DialogFooter>
                            <Button onClick={onClose} type="button" variant="secondary" className="mr-2">
                                <X className="w-4 h-4 mr-2"/>
                                Cancel
                            </Button>
                            <Button type="submit">
                                <Save className="w-4 h-4 mr-2"/>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

type FieldProps = {
    leaveTypes?: LeaveTypeResponse[];
    dialogForm: UseFormReturn<z.infer<typeof LeaveTypeSchema>>;
    form?: UseFormReturn<FormInputs>;
};

function TypeIdField({leaveTypes, dialogForm, form}: FieldProps) {
    const activatedTypes = form.watch("activatedTypes");

    return (
        <FormField
            control={dialogForm.control}
            name="typeId"
            render={({field, fieldState}) => (
                <FormItem>
                    <FormLabel>Leave Type</FormLabel>
                    <FormControl>
                        <Select
                            onValueChange={(value) => field.onChange(Number(value))}
                            value={field.value?.toString() || ""}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a leave type"/>
                            </SelectTrigger>
                            <SelectContent>
                                {leaveTypes
                                    ?.filter(type =>
                                        type.status !== 'ARCHIVED' &&
                                        !activatedTypes.some(
                                            activatedType => activatedType.typeId === type.id
                                        )
                                    )
                                    .map((type) => (
                                        <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
            )}
        />
    );
}

function AmountField({dialogForm}: FieldProps) {
    return (
        <FormField
            control={dialogForm.control}
            name="amount"
            render={({field, fieldState}) => (
                <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                        <Input
                            type="number"
                            min={1}
                            placeholder="Enter amount"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
            )}
        />
    );
}

function RequiresApprovalField({dialogForm}: FieldProps) {
    return (
        <FormField
            control={dialogForm.control}
            name="requiresApproval"
            render={({field}) => (
                <FormItem>
                    <div className="flex items-center gap-2">
                        <Checkbox checked={field.value || false} onCheckedChange={field.onChange}/>
                        <FormLabel>Requires Approval</FormLabel>
                    </div>
                </FormItem>
            )}
        />
    );
}