import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Bell} from "lucide-react";
import {NotificationPopover} from "@/modules/notification/components/NotificationPopover.tsx";
import {Notification, NotificationStatus} from "@/core/types/notifications.ts";
import {getNotifications, getNotificationsCount, createNotificationRead} from "@/core/services/notificationService.ts";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import {toast} from "@/components/ui/use-toast.ts";

export const NotificationBell: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchNotifications();
        fetchNotificationsCount();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await getNotifications({}, 1, 10);
            setNotifications(response.contents);
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error);
            setErrorMessage(errorMessage);
            toast({title: "Error", description: errorMessage, variant: "destructive",});        }
    };

    const fetchNotificationsCount = async () => {
        try {
            const response = await getNotificationsCount();
            setUnreadCount(response.unreadCount);
            setTotalCount(response.totalCount);
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error);
            setErrorMessage(errorMessage);
            toast({title: "Error", description: errorMessage, variant: "destructive",});
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await createNotificationRead([id]);

            setNotifications((prevNotifications) =>
                prevNotifications.map((n) => n.id === id ? {...n, status: NotificationStatus.READ} : n)
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error);
            setErrorMessage(errorMessage);
            toast({title: "Error", description: errorMessage, variant: "destructive",});
        }
    };

    const markAllAsRead = async () => {
        try {
            const unreadIds = notifications
                .filter((n) => n.status === NotificationStatus.SENT)
                .map((n) => n.id);

            if (unreadIds.length === 0) return;

            await createNotificationRead(unreadIds);

            setNotifications((prevNotifications) =>
                prevNotifications.map((n) => ({...n, status: NotificationStatus.READ}))
            );
            setUnreadCount(0);
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error);
            setErrorMessage(errorMessage);
            toast({title: "Error", description: errorMessage, variant: "destructive",});
        }
    };

    const toggleNotificationPanel = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleNotificationPanel}
                className="h-8 w-8 text-gray-500 hover:text-gray-600 relative"
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5"/>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </Button>

            {isOpen && (
                <NotificationPopover
                    notifications={notifications}
                    onClose={toggleNotificationPanel}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                />
            )}
        </div>
    );
};