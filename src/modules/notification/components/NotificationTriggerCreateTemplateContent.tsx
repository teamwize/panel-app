import {FormField, FormItem, FormControl, FormMessage} from '@/components/ui/form';
import {Tabs, TabsTrigger, TabsList} from '@/components/ui/tabs';
import {Textarea} from '@/components/ui/textarea';
import {Separator} from '@/components/ui/separator';
import {UseFormReturn} from "react-hook-form";
import {TriggerCreateInputs} from "@/modules/notification/pages/NotificationTriggerCreatePage.tsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {ChevronRight, Copy, Info} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {ScrollArea} from '@/components/ui/scroll-area';
import {toast} from "@/components/ui/use-toast.ts";
import {EventSchema, FieldSchema, SchemaObject} from "@/core/types/notifications.ts";

interface TemplateContentProps {
    form: UseFormReturn<TriggerCreateInputs>;
    activeTab: 'text' | 'html';
    setActiveTab: (tab: 'text' | 'html') => void;
    selectedSchema: EventSchema;
}

export default function NotificationTriggerCreateTemplateContent({form, activeTab, setActiveTab,selectedSchema}: TemplateContentProps) {
    const availableVariables = selectedSchema ? getVariablesFromSchema(selectedSchema.schema) : {};
    return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Template Content</h3>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Define the content for different formats</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
        <Separator />

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
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea placeholder="Enter text template content..." className="min-h-[400px] font-mono"{...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {activeTab === 'html' && (
                            <FormField
                                control={form.control}
                                name="htmlTemplate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea placeholder="Enter HTML template content..." className="min-h-[400px] font-mono"{...field}/>
                                        </FormControl>
                                        <FormMessage />
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
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Click variable to copy to clipboard</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    {selectedSchema && (<Badge variant="outline" className="text-xs">{selectedSchema.name}</Badge>)}
                </div>

                {!selectedSchema ? (
                    <div className="flex items-center justify-center h-[200px] border rounded-md bg-muted/10">
                        <p className="text-sm text-muted-foreground">Select an event type to see available variables</p>
                    </div>
                ) : (
                    <ScrollArea className="h-[400px]">
                        <div className="space-y-1 font-mono text-sm">
                            {Object.entries(availableVariables).map(([category, variables]) => (
                                <div key={category}>
                                    <div className="flex items-center py-2">
                                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
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
                                                    {variable.required && (<span className="text-[10px] text-orange-500">required</span>)}
                                                </div>
                                                <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 mr-2" />
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
    );
}

const getVariablesFromSchema = (schema: SchemaObject): { [key: string]: any[] } => {
    const variables: { [key: string]: {
            name: string;
            description: string;
            type: string;
            required: boolean;
            enumValues?: string[];
        }[] } = {};

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
