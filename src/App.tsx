import Root from './modules/routes';
import {useContext} from "react";
import {Sidebar, Toolbar} from './core/components';
import {UserContext, UserContextProvider} from './contexts/UserContext';
import {ThemeContextProvider} from './contexts/ThemeContext';
import { PageTitleProvider } from './contexts/PageTitleContext';

export default function App() {
    return (
        <ThemeContextProvider>
            <UserContextProvider>
                <PageTitleProvider>
                <AppLayout/>
                </PageTitleProvider>
            </UserContextProvider>
        </ThemeContextProvider>
    )
}

function AppLayout() {
    const {isAuthenticated} = useContext(UserContext);

    return (
        isAuthenticated() ? (
            <div className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
                <Sidebar/>
                <div className="flex flex-col">
                    <Toolbar/>
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