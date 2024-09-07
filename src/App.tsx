import Root from './modules/routes';
import {useContext, useEffect, useState} from "react";
import {toast} from "@/components/ui/use-toast";
import {Sidebar, Toolbar} from './core/components';
import {UserContext, UserContextProvider} from './contexts/UserContext';
import {ThemeContextProvider} from './contexts/ThemeContext';
import {getCurrentEmployee, getOrganization} from "@/services/WorkiveApiClient";
import {OrganizationResponse, UserResponse} from "@/constants/types";
import {getErrorMessage} from "~/utils/errorHandler.ts";
import {isTokenExpired} from "@/utils/jwtUtils";

export default function App() {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [organization, setOrganization] = useState<OrganizationResponse | null>(null);

    if (isAuthenticated()) {
        useEffect(() => {
            getCurrentEmployee()
                .then((data: UserResponse) => {
                    console.log("Success:", data);
                    setUser(data);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    const errorMessage = getErrorMessage(error);
                    toast({
                        title: "Error",
                        description: errorMessage,
                        variant: "destructive"
                    });
                });
        }, []);

        useEffect(() => {
            getOrganization()
                .then((data: OrganizationResponse) => {
                    console.log("Success:", data);
                    setOrganization(data);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    const errorMessage = getErrorMessage(error);
                    toast({
                        title: "Error",
                        description: errorMessage,
                        variant: "destructive"
                    });
                });
        }, []);
    }

    return (
        <ThemeContextProvider>
            <UserContextProvider user={user} organization={organization}>
                <AppLayout/>
            </UserContextProvider>
        </ThemeContextProvider>
    )
}

function AppLayout() {
    const {isAuthenticated, user} = useContext(UserContext);
    return (
        isAuthenticated() ? (
            <div className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
                <Sidebar/>
                <div className="flex flex-col">
                    <Toolbar user={user}/>
                    <Root/>
                </div>
            </div>
        ) : (
            <div className="min-h-screen w-full">
                <Root/>
            </div>
        )
    )
}

const isAuthenticated = (): boolean => {
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    return accessToken != null && accessToken !== "" && !isTokenExpired(accessToken)
}