import React, {useEffect} from "react";
import {z} from "zod";
import {useForm, UseFormReturn} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FormInputs, LeaveTypeSchema} from "@/modules/leave/pages/LeavePolicyUpdatePage.tsx";

type ActivateLeaveTypeDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: z.infer<typeof LeaveTypeSchema>) => void;
    schema: typeof LeaveTypeSchema;
    defaultValues?: z.infer<typeof LeaveTypeSchema>;
    form: UseFormReturn<FormInputs>;
};

export default function LeavePolicyActivatedTypeUpdateDialog({
                                                                 isOpen,
                                                                 onClose,
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
                    <DialogTitle>Edit Leave Type</DialogTitle>
                </DialogHeader>
                <Form {...dialogForm}>
                    <form onSubmit={dialogForm.handleSubmit(handleSave)} className="space-y-4">
                        <AmountField dialogForm={dialogForm}/>
                        <RequiresApprovalField dialogForm={dialogForm}/>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

type FieldProps = {
    dialogForm: UseFormReturn<z.infer<typeof LeaveTypeSchema>>;
    form?: UseFormReturn<FormInputs>;
};

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