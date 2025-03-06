import React from "react";
import {UserContextProvider} from './contexts/UserContext';
import {ThemeContextProvider} from './contexts/ThemeContext';
import Root from "@/Routes.tsx";

export default function App() {
    return (
        <ThemeContextProvider>
            <UserContextProvider>
                <Root/>
            </UserContextProvider>
        </ThemeContextProvider>
    )
}