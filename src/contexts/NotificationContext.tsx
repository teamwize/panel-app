import { createContext, useState, ReactNode } from "react";

interface NotificationContextType {
    selectedNotificationId: number | null;
    setSelectedNotificationId: (id: number | null) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
    selectedNotificationId: null,
    setSelectedNotificationId: ()=> {}
});

interface NotificationContextProviderType {
    children: ReactNode
}

export const NotificationContextProvider = ({ children }: NotificationContextProviderType) => {
    const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null);

    return (
        <NotificationContext.Provider value={{ selectedNotificationId, setSelectedNotificationId }}>
            {children}
        </NotificationContext.Provider>
    );
};