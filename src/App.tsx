import React from "react";
import {UserContextProvider} from './contexts/UserContext';
import {ThemeContextProvider} from './contexts/ThemeContext';
import Root from "@/Routes.tsx";
import {NotificationContextProvider} from "@/contexts/NotificationContext.tsx";

export default function App() {
    return (
        <ThemeContextProvider>
            <UserContextProvider>
                <NotificationContextProvider>
                    <Root/>
                </NotificationContextProvider>
            </UserContextProvider>
        </ThemeContextProvider>
    )
}