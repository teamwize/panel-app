import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ChannelButton } from '@/modules/notification/components/ChannelButton.tsx';
import {EventSchema, NotificationChannel} from '@/core/types/notifications';
import {UseFormReturn} from "react-hook-form";
import {TriggerCreateInputs} from "@/modules/notification/pages/TriggerCreatePage.tsx";

interface DeliveryConfigurationProps {
    form: UseFormReturn<TriggerCreateInputs>;
    selectedChannels: NotificationChannel[];
    setSelectedChannels: (channels: NotificationChannel[]) => void;
    selectedEventSchema: EventSchema | null;
}

export default function DeliveryConfigurationSection({ form, selectedChannels, setSelectedChannels, selectedEventSchema }: DeliveryConfigurationProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Delivery Settings</h3>
            <Separator />
            <div className="space-y-6">
                <FormField
                    control={form.control}
                    name="channels"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel>Notification Channels</FormLabel>
                            <div className="flex flex-wrap flex-row gap-3">
                                {Object.values(NotificationChannel).map((channel) => (
                                    <ChannelButton
                                        key={channel}
                                        channel={channel}
                                        isSelected={selectedChannels.includes(channel)}
                                        onToggle={(channel) => {
                                            const newChannels = selectedChannels.includes(channel)
                                                ? selectedChannels.filter((c) => c !== channel)
                                                : [...selectedChannels, channel];
                                            setSelectedChannels(newChannels);
                                            field.onChange(newChannels);
                                        }}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="receptors"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Receptors</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!selectedEventSchema}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select receptor type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {selectedEventSchema?.receptors.map((receptor) => (
                                        <SelectItem key={receptor} value={receptor}>{receptor}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            <p className="text-sm text-muted-foreground">Choose who should receive this notification based on the selected event type.</p>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}