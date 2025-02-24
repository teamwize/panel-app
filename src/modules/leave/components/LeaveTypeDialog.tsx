import React from 'react';
import {useForm, UseFormReturn} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {LeaveTypeCycle} from "@/core/types/enum.ts";
import {LeaveTypeCreateRequest, LeaveTypeResponse, LeaveTypeUpdateRequest} from "@/core/types/leave.ts";
import EmojiPicker, {emojis} from "@/components/EmojiPicker.tsx";
import {Save, X} from "lucide-react";

const FormSchema = z.object({
    name: z.string().min(2, {message: "Leave type name must be over 2 characters"}).max(50, {message: "Leave type name must be under 50 characters"}),
    cycle: z.nativeEnum(LeaveTypeCycle, { errorMap: () => ({ message: "Cycle is required" }) }),
    amount: z.number().min(1, { message: "Amount must be greater than 0" }),
    requiresApproval: z.boolean(),
    symbol: z.string().optional()
});

type LeaveTypeInputs = z.infer<typeof FormSchema>;

interface LeaveTypeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: LeaveTypeCreateRequest) => void;
    initialData?: LeaveTypeResponse | null;
    isUpdateMode?: boolean;
}

export function LeaveTypeDialog({isOpen, onClose, onSubmit, initialData, isUpdateMode}: LeaveTypeDialogProps) {
    const form = useForm<LeaveTypeInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: initialData?.name || "",
            symbol: initialData?.symbol || "",
            cycle: initialData?.cycle || LeaveTypeCycle.PER_YEAR,
            amount: initialData?.amount || 1,
            requiresApproval: initialData?.requiresApproval || false,
        },
    });

    const handleSubmit = (data: LeaveTypeInputs) => {
        if (isUpdateMode && initialData?.id) {
            const updateData: LeaveTypeUpdateRequest = {
                name: data.name,
                cycle: data.cycle,
                amount: data.amount,
                requiresApproval: data.requiresApproval,
                symbol: data.symbol || "",
            };
            onSubmit({...updateData, id: initialData.id} as any);
        } else {
            const createData: LeaveTypeCreateRequest = {
                name: data.name,
                cycle: data.cycle,
                amount: data.amount,
                requiresApproval: data.requiresApproval,
                symbol: data.symbol || "",
            };
            onSubmit(createData);
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Update Leave Type' : 'Create Leave Type'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <NameField form={form} />
                        <SymbolField form={form}/>
                        <CycleField form={form} />
                        <AmountField form={form} />
                        <RequiresApprovalField form={form} />

                        <DialogFooter>
                            <Button onClick={onClose} type="button" variant="secondary" className="mr-2">
                                <X className="w-4 h-4 mr-2"/>
                                Cancel
                            </Button>
                            <Button type="submit">
                                <Save className="w-4 h-4 mr-2"/>
                                {initialData ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

type FieldProps = {
    form: UseFormReturn;
};

function NameField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter leave type name" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

function SymbolField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="symbol"
            render={({field}) => (
                <FormItem className='flex flex-col gap-1 items-start'>
                    <FormLabel>Symbol</FormLabel>
                    <FormControl>
                        <EmojiPicker
                            onEmojiSelect={(emoji) => field.onChange(emoji.symbol)}
                            defaultEmoji={emojis.find(e => e.symbol === field.value) || null}
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
}

function CycleField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="cycle"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Cycle</FormLabel>
                    <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a cycle" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={LeaveTypeCycle.UNLIMITED}>Unlimited</SelectItem>
                                <SelectItem value={LeaveTypeCycle.PER_MONTH}>Per Month</SelectItem>
                                <SelectItem value={LeaveTypeCycle.PER_YEAR}>Per Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

function AmountField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                        <Input
                            type="number"
                            placeholder="Enter amount"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

function RequiresApprovalField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="requiresApproval"
            render={({ field }) => (
                <FormItem>
                    <div className="flex items-center gap-2">
                        <FormControl>
                            <Checkbox
                                id="requiresApproval"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <FormLabel htmlFor="requiresApproval">Requires Approval</FormLabel>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}