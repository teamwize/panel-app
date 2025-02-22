import React, {useEffect} from "react";
import {z} from "zod";
import {useForm, UseFormReturn} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";

const FormSchema = z.object({
    typeId: z.number({required_error: "Leave type is required."}),
    amount: z.number().min(1, {message: "Amount must be at least 1."}),
    requiresApproval: z.boolean(),
});

type LeavePolicyActivatedTypeInputs = z.infer<typeof FormSchema>;

type ActivateLeaveTypeDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: LeavePolicyActivatedTypeInputs) => void;
    defaultValues?: LeavePolicyActivatedTypeInputs;
};

export default function LeavePolicyActivatedTypeUpdateDialog({
                                                                 isOpen,
                                                                 onClose,
                                                                 onSave,
                                                                 defaultValues,
                                                             }: ActivateLeaveTypeDialogProps) {
    const dialogForm = useForm<LeavePolicyActivatedTypeInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            typeId: defaultValues?.typeId ?? 0, // Ensure a valid default
            amount: defaultValues?.amount ?? 1,
            requiresApproval: defaultValues?.requiresApproval ?? false,
        },
    });

    // Reset form values when the dialog opens
    useEffect(() => {
        if (defaultValues) {
            dialogForm.reset(defaultValues);
        }
    }, [isOpen, defaultValues, dialogForm]);

    const handleSave = (data: LeavePolicyActivatedTypeInputs) => {
        onSave(data);
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
                        <AmountField dialogForm={dialogForm} />
                        <RequiresApprovalField dialogForm={dialogForm} />
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
    dialogForm: UseFormReturn<LeavePolicyActivatedTypeInputs>;
};

function AmountField({ dialogForm }: FieldProps) {
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