import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Card} from '@/components/ui/card';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Plus, Pencil, Trash2} from 'lucide-react';
import {NotificationTrigger} from '@/core/types/notifications.ts';
import {getNotificationTriggers} from '@/core/services/notificationService';
import PageHeader from '@/components/layout/PageHeader';
import PageContent from '@/components/layout/PageContent';
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {toast} from "@/components/ui/use-toast.ts";
import {Alert, AlertDescription} from "@/components/ui/alert.tsx";

export function NotificationTriggersPage() {
    const navigate = useNavigate();
    const [triggers, setTriggers] = useState<NotificationTrigger[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchTriggers = async () => {
            try {
                const response = await getNotificationTriggers();
                setTriggers(response);
            } catch (error) {
                const errorMessage = getErrorMessage(error as Error);
                setErrorMessage(errorMessage);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTriggers();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-[400px]">
                    <div className="animate-pulse space-y-4">
                        <p className="text-sm text-muted-foreground">Loading triggers...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <PageHeader backButton='/notifications' title="Notification Triggers">
                <Button className='px-2 h-9' onClick={() => navigate('/notifications/triggers/create')}>
                    <Plus className="h-4 w-4 mr-1"/>
                    Create Trigger
                </Button>
            </PageHeader>
            <PageContent>
                {errorMessage ? (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Event Type</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Receptors</TableHead>
                                    <TableHead>Channels</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {triggers.length ? (
                                    triggers.map((trigger) => (<TriggerRow key={trigger.id} trigger={trigger}/>))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-gray-500">No notification trigger found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                )}
            </PageContent>
        </>
    );
}

interface TriggerRowProps {
    trigger: NotificationTrigger
}

function TriggerRow({trigger}: TriggerRowProps) {
    const navigate = useNavigate();
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ENABLED':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'DISABLED':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <TableRow key={trigger.id}>
            <TableCell>{trigger.eventType}</TableCell>
            <TableCell>{trigger.title}</TableCell>
            <TableCell>{trigger.name}</TableCell>
            <TableCell>{trigger.receptors}</TableCell>
            <TableCell>
                <div className="flex gap-1 flex-wrap">
                    {trigger.channels.map((channel) => (<Badge key={channel} variant="outline" className="mr-1">{channel}</Badge>))}
                </div>
            </TableCell>
            <TableCell>
                <Badge variant="outline" className={getStatusColor(trigger.status)}>{trigger.status}</Badge>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/notifications/triggers/${trigger.id}/edit`);
                        }}
                    >
                        <Pencil className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Add delete confirmation dialog here
                        }}
                    >
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}