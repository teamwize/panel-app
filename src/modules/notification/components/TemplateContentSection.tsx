import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {UseFormReturn} from "react-hook-form";
import {TriggerCreateInputs} from "@/modules/notification/pages/TriggerCreatePage.tsx";

interface TemplateContentProps {
    form: UseFormReturn<TriggerCreateInputs>;
    activeTab: 'text' | 'html';
    setActiveTab: (tab: 'text' | 'html') => void;
}

export default function TemplateContentSection({ form, activeTab, setActiveTab }: TemplateContentProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Template Content</h3>
            <Separator />
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
                                        <Textarea placeholder="Enter text template content..." className="min-h-[200px] font-mono" {...field} />
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
                                        <Textarea placeholder="Enter HTML template content..." className="min-h-[200px] font-mono" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>
            </Tabs>
        </div>
    );
}