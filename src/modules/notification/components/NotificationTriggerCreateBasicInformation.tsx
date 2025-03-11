import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {UseFormReturn} from "react-hook-form";
import {TriggerCreateInputs} from "@/modules/notification/pages/NotificationTriggerCreatePage.tsx";

interface BasicInformationSectionProps {
    form: UseFormReturn<TriggerCreateInputs>;
}

export default function NotificationTriggerCreateBasicInformation({ form }: BasicInformationSectionProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <Separator />
            <div className="grid gap-6 sm:grid-cols-2">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter trigger title" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter trigger name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
        </div>
    );
}