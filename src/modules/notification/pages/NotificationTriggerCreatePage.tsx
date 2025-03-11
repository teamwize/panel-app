import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import PageContent from '@/components/layout/PageContent';
import { EventSchema, EventType, NotificationChannel } from '@/core/types/notifications.ts';
import { createNotificationTrigger, getNotificationEventSchemas } from '@/core/services/notificationService';
import { getErrorMessage } from '@/core/utils/errorHandler';
import { Loader2 } from 'lucide-react';
import { PageSection } from '@/components/layout/PageSection.tsx';
import {Form} from '@/components/ui/form'
import NotificationTriggerCreateBasicInformation from "@/modules/notification/components/NotificationTriggerCreateBasicInformation.tsx";
import NotificationTriggerCreateEventDetails from "@/modules/notification/components/NotificationTriggerCreateEventDetails.tsx";
import NotificationTriggerCreateTemplateContent from "@/modules/notification/components/NotificationTriggerCreateTemplateContent.tsx";
import NotificationTriggerCreateDeliverySettings from "@/modules/notification/components/NotificationTriggerCreateDeliverySettings.tsx";

const FormSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    name: z.string().min(1, 'Name is required'),
    textTemplate: z.string().min(1, 'Text template is required'),
    htmlTemplate: z.string().min(1, 'HTML template is required'),
    eventType: z.nativeEnum(EventType),
    templateId: z.number(),
    channels: z.array(z.nativeEnum(NotificationChannel)).min(1, 'Select at least one channel'),
    receptors: z.string().min(1, 'Receptors is required'),
});

export type TriggerCreateInputs = z.infer<typeof FormSchema>;

export default function NotificationTriggerCreatePage() {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedChannels, setSelectedChannels] = useState<NotificationChannel[]>([]);
    const [activeTab, setActiveTab] = useState<'text' | 'html'>('text');
    const [eventSchemas, setEventSchemas] = useState<EventSchema[]>([]);
    const [selectedEventSchema, setSelectedEventSchema] = useState<EventSchema | null>(null);

    useEffect(() => {
        const fetchEventSchemas = async () => {
            try {
                const schemas = await getNotificationEventSchemas();
                setEventSchemas(schemas);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch event schemas",
                    variant: "destructive",
                });
            }
        };
        fetchEventSchemas();
    }, []);

    const form = useForm<TriggerCreateInputs>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            channels: [],
            receptors: '',
            title: '',
            name: '',
            textTemplate: '',
            htmlTemplate: '',
            eventType: EventType.USER_CREATED,
            templateId: 0,
        },
    });

    const onSubmit = async (data: TriggerCreateInputs) => {
        try {
            setIsProcessing(true);
            await createNotificationTrigger({
                title: data.title,
                name: data.name,
                textTemplate: data.textTemplate,
                htmlTemplate: data.htmlTemplate,
                eventType: data.eventType,
                templateId: data.templateId,
                channels: data.channels,
                receptors: data.receptors,
            });

            toast({
                title: 'Success',
                description: 'Notification trigger created successfully!',
            });
            navigate('/notifications/triggers');
        } catch (error) {
            toast({
                title: 'Error',
                description: getErrorMessage(error as Error),
                variant: 'destructive',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <PageHeader backButton='/notifications/triggers' title="Create Notification Trigger"/>
            <PageContent>
                <PageSection title='Trigger Configuration' description="Set up the conditions and delivery settings for your notification trigger." />

                <Card className="mx-auto">
                    <CardContent className='p-6'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <NotificationTriggerCreateBasicInformation form={form} />
                                <NotificationTriggerCreateEventDetails form={form} eventSchemas={eventSchemas} setSelectedEventSchema={setSelectedEventSchema} />
                                <NotificationTriggerCreateTemplateContent form={form} activeTab={activeTab} setActiveTab={setActiveTab} selectedSchema={selectedEventSchema} />
                                <NotificationTriggerCreateDeliverySettings form={form} selectedChannels={selectedChannels} setSelectedChannels={setSelectedChannels} selectedEventSchema={selectedEventSchema} />
                                <div className="flex justify-end pt-4 border-t">
                                    <Button variant="outline" onClick={() => navigate('/notifications/triggers')} disabled={isProcessing}>
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isProcessing} className="ml-2">
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Create Trigger
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </PageContent>
        </>
    );
}