import Root from './Routes.tsx';
import {useContext} from "react";
import {UserContext, UserContextProvider} from './contexts/UserContext';
import {ThemeContextProvider} from './contexts/ThemeContext';
import Sidebar from './components/sidebar/Sidebar';

export default function App() {
    return (
        <ThemeContextProvider>
            <UserContextProvider>
                <AppLayout/>
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