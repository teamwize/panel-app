import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import {UseFormReturn} from "react-hook-form";
import {EventSchema} from "@/core/types/notifications.ts";
import {TriggerCreateInputs} from "@/modules/notification/pages/NotificationTriggerCreatePage.tsx";

interface EventConfigurationProps {
    form: UseFormReturn<TriggerCreateInputs>;
    eventSchemas: EventSchema[];
    setSelectedEventSchema: (schema: EventSchema | null) => void;
}

export default function NotificationTriggerCreateEventDetails({ form, eventSchemas, setSelectedEventSchema }: EventConfigurationProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Event Details</h3>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Select when this notification should be triggered</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <Separator />
            <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                    control={form.control}
                    name="eventType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Type</FormLabel>
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    const schema = eventSchemas.find(s => s.name === value);
                                    setSelectedEventSchema(schema || null);
                                }}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an event type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {eventSchemas.map((schema) => (
                                        <SelectItem key={schema.name} value={schema.name}>
                                            <div className="flex flex-col">
                                                <span>{schema.name}</span>
                                                <span className="text-xs text-muted-foreground">{schema.description}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}