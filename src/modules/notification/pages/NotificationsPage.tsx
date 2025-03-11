import React, {useEffect, useState} from 'react';
import {Card} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {getNotifications} from '@/core/services/notificationService';
import PageHeader from '@/components/layout/PageHeader';
import PageContent from '@/components/layout/PageContent';
import {formatDate} from 'date-fns';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Bell, CheckCircle2, XCircle, Clock, AlertCircle, FlaskConical} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useNavigate} from 'react-router-dom';
import {Notification, NotificationStatus} from "@/core/types/notifications.ts";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {toast} from "@/components/ui/use-toast.ts";
import {Alert, AlertDescription} from "@/components/ui/alert.tsx";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await getNotifications({}, 1, 10);
            setNotifications(response.contents);
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

    const getStatusIcon = (status: NotificationStatus) => {
        switch (status) {
            case NotificationStatus.SENT:
                return <CheckCircle2 className="h-5 w-5 text-green-500"/>;
            case NotificationStatus.FAILED:
                return <XCircle className="h-5 w-5 text-red-500"/>;
            case NotificationStatus.PENDING:
                return <Clock className="h-5 w-5 text-yellow-500"/>;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-500"/>;
        }
    };

    const getStatusColor = (status: NotificationStatus) => {
        switch (status) {
            case NotificationStatus.SENT:
                return 'bg-green-50 text-green-700 border-green-200';
            case NotificationStatus.FAILED:
                return 'bg-red-50 text-red-700 border-red-200';
            case NotificationStatus.PENDING:
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-[400px]">
                    <div className="animate-pulse space-y-4">
                        <Bell className="h-8 w-8 text-muted-foreground"/>
                        <p className="text-sm text-muted-foreground">Loading notifications...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <PageHeader backButton='/settings' title="Notifications">
                <Button className='px-2 h-9' onClick={() => navigate('/notifications/triggers')}>
                    <FlaskConical className="h-4 w-4 mr-1"/>
                    Triggers
                </Button>
            </PageHeader>
            <PageContent>
                {errorMessage ? (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                ) : (
                    <Card className="mx-auto">
                        <ScrollArea>
                            <div className="divide-y">
                                {notifications.map((notification) => (
                                    <div key={notification.id}
                                         className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                                        <div className="flex items-start gap-4">
                                            <div className="shrink-0">{getStatusIcon(notification.status)}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <h3 className="font-medium">{notification.trigger.name}</h3>
                                                    <Badge variant="outline" className="shrink-0">{notification.channel}</Badge>
                                                    <Badge variant="outline" className={`shrink-0 ${getStatusColor(notification.status)}`}>{notification.status}</Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">{notification.textContent}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>Event: {notification.event}</span>
                                                    <span>•</span>
                                                    <span>Sent: {formatDate(new Date(notification.sentAt), 'MMM dd, yyyy HH:mm')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {notifications.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <Bell className="h-12 w-12 text-primary mb-4"/>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
                                        <p className="text-gray-500">You have no notifications. Once a notification is sent, it will appear here.</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </Card>
                )}
            </PageContent>
        </>
    );
}