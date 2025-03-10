import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {toast} from '@/components/ui/use-toast';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {X, Save, Info, Copy, ChevronRight} from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import PageContent from '@/components/layout/PageContent';
import {EventSchema, EventType, FieldSchema, NotificationChannel, SchemaObject} from '@/core/types/notifications.ts';
import {createNotificationTrigger, getNotificationEventSchemas} from '@/core/services/notificationService';
import {getErrorMessage} from '@/core/utils/errorHandler';
import {Badge} from '@/components/ui/badge';
import {Separator} from '@/components/ui/separator';
import {Loader2} from 'lucide-react';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import {Textarea} from '@/components/ui/textarea';
import {Tabs, TabsTrigger, TabsList} from '@/components/ui/tabs';
import {ScrollArea} from "@/components/ui/scroll-area";
import {PageSection} from "@/components/layout/PageSection.tsx";
import {ChannelButton} from "@/modules/notification/components/ChannelButton.tsx";

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

type TriggerCreateInputs = z.infer<typeof FormSchema>;

export default function TriggerCreatePage() {
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

    const getVariablesFromSchema = (schema: SchemaObject): { [key: string]: any[] } => {
        const variables: {
            [key: string]: {
                name: string;
                description: string;
                type: string;
                required: boolean;
                enumValues?: string[];
            }[]
        } = {};

        const processField = (field: FieldSchema, parentPath = '') => {
            const path = parentPath ? `${parentPath}.${field.name}` : field.name;
            const category = path.split('.')[0];

            if (!variables[category]) {
                variables[category] = [];
            }

            let fieldType = field.type;
            if (field.enumValues?.length) {
                fieldType = `enum(${field.enumValues.join('|')})`;
            } else if (field.items) {
                fieldType = `array<${field.items.type}>`;
            }

            variables[category].push({
                name: `{{${path}}}`,
                description: field.description || `${field.type} field`,
                type: fieldType,
                required: field.required,
                enumValues: field.enumValues
            });

            if (field.properties) {
                field.properties.forEach(prop => processField(prop, path));
            }
        };

        schema.properties.forEach(field => processField(field));
        return variables;
    };

    const availableVariables = selectedEventSchema
        ? getVariablesFromSchema(selectedEventSchema.schema)
        : {};

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
                title: data.title || "",
                name: data.name || "",
                textTemplate: data.textTemplate || "",
                htmlTemplate: data.htmlTemplate || "",
                eventType: data.eventType,
                templateId: data.templateId || 0,
                channels: data.channels || [],
                receptors: data.receptors || "",
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
                <PageSection title='Trigger Configuration' description="Set up the conditions and delivery settings for your notification trigger."></PageSection>
                <Card className="mx-auto">
                    <CardContent className='p-6'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid gap-8">
                                    {/* Basic Information Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-medium">Basic Information</h3>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="h-4 w-4 text-muted-foreground"/>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Basic details about the notification trigger</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Separator/>
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="title"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Title</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter trigger title" {...field} />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter trigger name" {...field} />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Event Configuration Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-medium">Event Details</h3>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="h-4 w-4 text-muted-foreground"/>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Select when this notification should be triggered</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Separator/>
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="eventType"
                                                render={({field}) => (
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
                                                                    <SelectValue placeholder="Select an event type"/>
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
                                                        <FormMessage/>
                                                        {selectedEventSchema && (<p className="text-sm text-muted-foreground mt-2">{selectedEventSchema.description}</p>)}
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>


                                    {/* Template Content Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-medium">Template Content</h3>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Info className="h-4 w-4 text-muted-foreground"/>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Define the content for different formats</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                        <Separator/>

                                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                            <div className="lg:col-span-3">
                                                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'text' | 'html')}>
                                                    <TabsList className="mb-4">
                                                        <TabsTrigger value="text">Text Template</TabsTrigger>
                                                        <TabsTrigger value="html">HTML Template</TabsTrigger>
                                                    </TabsList>
                                                    <div className="space-y-4">
                                                        {activeTab === 'text' && (
                                                            <FormField
                                                                control={form.control}
                                                                name="textTemplate"
                                                                render={({field}) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Textarea placeholder="Enter text template content..." className="min-h-[400px] font-mono" {...field}/>
                                                                        </FormControl>
                                                                        <FormMessage/>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        )}
                                                        {activeTab === 'html' && (
                                                            <FormField
                                                                control={form.control}
                                                                name="htmlTemplate"
                                                                render={({field}) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Textarea placeholder="Enter HTML template content..." className="min-h-[400px] font-mono" {...field}/>
                                                                        </FormControl>
                                                                        <FormMessage/>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        )}
                                                    </div>
                                                </Tabs>
                                            </div>

                                            <div className="lg:col-span-2 space-y-4 lg:border-l lg:pl-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium">Available Variables</h4>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <Info className="h-4 w-4 text-muted-foreground"/>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Click variable to copy to clipboard</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                    {selectedEventSchema && (<Badge variant="outline" className="text-xs">{selectedEventSchema.name}</Badge>)}
                                                </div>

                                                {!selectedEventSchema ? (
                                                    <div className="flex items-center justify-center h-[200px] border rounded-md bg-muted/10">
                                                        <p className="text-sm text-muted-foreground px-2">Select an event type to see available variables</p>
                                                    </div>
                                                ) : (
                                                    <ScrollArea className="h-[400px]">
                                                        <div className="space-y-1 font-mono text-sm">
                                                            {Object.entries(availableVariables).map(([category, variables]) => (
                                                                <div key={category}>
                                                                    <div className="flex items-center py-2">
                                                                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0"/>
                                                                        <span className="font-semibold ml-1">{category}</span>
                                                                        <Badge variant="outline" className="ml-2 text-xs">{variables.length}</Badge>
                                                                    </div>
                                                                    <div className="ml-4 border-l pl-3 space-y-1">
                                                                        {variables.map((variable) => (
                                                                            <div
                                                                                key={variable.name}
                                                                                className="flex items-center py-1 hover:bg-muted/50 rounded pl-2 cursor-pointer group"
                                                                                onClick={() => {
                                                                                    navigator.clipboard.writeText(variable.name);
                                                                                    toast({
                                                                                        title: "Copied",
                                                                                        description: "Variable copied to clipboard",
                                                                                        duration: 2000,
                                                                                    });
                                                                                }}
                                                                            >
                                                                                <div className="flex-1 flex items-center gap-2">
                                          <span className="text-blue-600 dark:text-blue-400">{variable.name}</span>
                                                                                    <span className="text-muted-foreground text-xs">{variable.type}</span>
                                                                                    {variable.required && (<span className="text-[10px] text-orange-500">required</span>)}</div>
                                                                                <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 mr-2"/>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </ScrollArea>
                                                )}
                                            </div>
                                        </div>
                                    </div>


                                    {/* Delivery Configuration Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-medium">Delivery Settings</h3>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="h-4 w-4 text-muted-foreground"/>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Configure how and to whom the notification will be delivered</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Separator/>
                                        <div className="space-y-6">
                                            <FormField
                                                control={form.control}
                                                name="channels"
                                                render={({field}) => (
                                                    <FormItem className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <FormLabel>Notification Channels</FormLabel>
                                                        </div>
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
                                                        {selectedChannels.length === 0 && (<p className="text-sm text-muted-foreground">Select at least one notification channel</p>)}
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="receptors"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Receptors</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                            disabled={!selectedEventSchema}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select receptor type"/>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {selectedEventSchema?.receptors.map((receptor) => (<SelectItem key={receptor} value={receptor}>{receptor}</SelectItem>))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage/>
                                                        <p className="text-sm text-muted-foreground">Choose who should receive this notification based on the selected event type.</p>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t">
                                    <Button variant="outline" onClick={() => navigate('/notifications/triggers')} disabled={isProcessing}>
                                        <X className="w-4 h-4 mr-2"/>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isProcessing} className="ml-2">
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2"/>
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