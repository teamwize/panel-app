import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {Save, X} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {LeavePolicyActivatedTypeResponse} from "@/core/types/leave";

const FormSchema = z.object({
    amount: z.number().min(1, {message: "Amount must be at least 1."}),
    requiresApproval: z.boolean(),
});

type FormInputs = z.infer<typeof FormSchema>;

type UpdateDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedType: LeavePolicyActivatedTypeResponse) => void;
    defaultValues?: LeavePolicyActivatedTypeResponse;
};

export default function LeavePolicyActivatedTypeUpdateDialog({
                                                                 isOpen,
                                                                 onClose,
                                                                 onSave,
                                                                 defaultValues,
                                                             }: UpdateDialogProps) {
    const form = useForm<FormInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            amount: defaultValues?.amount ?? 1,
            requiresApproval: defaultValues?.requiresApproval ?? false,
        },
    });

    // Reset form values when the dialog opens with new data
    useEffect(() => {
        if (defaultValues) {
            form.reset({
                amount: defaultValues.amount,
                requiresApproval: defaultValues.requiresApproval,
            });
        }
    }, [defaultValues, form]);

    const handleSubmit = (data: FormInputs) => {
        if (!defaultValues) return;

        onSave({
            ...defaultValues,
            amount: data.amount,
            requiresApproval: data.requiresApproval,
        });

        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Leave Type</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({field}) => (
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
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="requiresApproval"
                            render={({field}) => (
                                <FormItem>
                                    <div className="flex items-center gap-2">
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                                        <FormLabel>Requires Approval</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={onClose}>
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