import Root from './Routes.tsx';
import React, {useContext} from "react";
import {UserContext, UserContextProvider} from './contexts/UserContext';
import {ThemeContextProvider} from './contexts/ThemeContext';
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout.tsx";
import UnauthenticatedLayout from "@/components/layout/UnauthenticatedLayout.tsx";

export const withDynamicLayout = (WrappedComponent: React.FC) => {
    return function WithLayout(props: any) {
        const {isAuthenticated} = useContext(UserContext);
        return isAuthenticated() ? (
            <AuthenticatedLayout>
                <WrappedComponent {...props} />
            </AuthenticatedLayout>
        ) : (
            <UnauthenticatedLayout>
                <WrappedComponent {...props} />
            </UnauthenticatedLayout>
        );
    };
};

export default function App() {
    return (
        <ThemeContextProvider>
            <UserContextProvider>
                <AppWithLayout/>
            </UserContextProvider>
        </ThemeContextProvider>
    )
}

const AppWithLayout = withDynamicLayout(Root);