import React, {useContext, useState} from 'react';
import clsx from 'clsx';
import {useLocation, Link} from 'react-router-dom';
import {Logo} from '.';
import {House, ChartPie, Settings, Building, Bell, User, Users, Clock, TreePalm} from 'lucide-react';
import {Button} from "@/components/ui/button";
import {UserContext} from "@/contexts/UserContext";
import {Badge} from "@/components/ui/badge"

const mainNavigation = [
    {name: 'Home', href: '/', icon: House},
    {name: 'Balance', href: '/balance', icon: ChartPie},
    {name: 'Settings', href: '/settings', icon: Settings},
];

const managementNavigation = [
    {name: 'Requests', href: '/requests', icon: Clock},
    {name: 'Organization', href: '/organization', icon: Building},
    {name: 'Leaves', href: '/leaves', icon: TreePalm},
    {name: 'Employees', href: '/employees', icon: User},
    {name: 'Teams', href: '/teams', icon: Users},
];

export default function Sidebar() {
    const [selectedOption, setSelectedOption] = useState<string>('');
    const location = useLocation();
    const {user} = useContext(UserContext);

    const handleNavigation = (path: string) => {
        setSelectedOption(path);
    };

    const isNavigationActive = (href: string) => {
        return location.pathname === href || selectedOption === href;
    };

    const isUserAdmin = user?.role === 'ORGANIZATION_ADMIN';

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-4">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link to="/" className="flex items-center gap-2 font-semibold">
                            <Logo className="h-6 w-6"/>
                            <span>Teamwize</span>
                        </Link>
                        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                            <Bell className="h-4 w-4"/>
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                    </div>

                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            {mainNavigation.map((item) =>
                                <NavigationLink
                                    key={item.name}
                                    href={item.href}
                                    title={item.name}
                                    isActive={isNavigationActive(item.href)}
                                    onClick={handleNavigation}
                                    Icon={item.icon}/>
                            )}

                            {isUserAdmin && (
                                <>
                                    <h1 className="px-3 text-[10px] text-muted-foreground uppercase tracking-wide mt-4 mb-2">Management</h1>
                                    {managementNavigation.map((item) =>
                                        <NavigationLink
                                            key={item.name}
                                            href={item.href}
                                            title={item.name}
                                            isActive={isNavigationActive(item.href)}
                                            onClick={handleNavigation}
                                            Icon={item.icon}/>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}

type NavigationLinkProps = {
    href: string;
    title: string;
    isActive: boolean;
    onClick: (page: string) => void;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

function NavigationLink({href, title, isActive, onClick, Icon}: NavigationLinkProps) {
    const classes = {
        base: 'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
        active: 'bg-indigo-100 dark:bg-indigo-800 bg-opacity-75',
        inactive: 'text-muted-foreground hover:text-primary',
    };

    return (
        <div key={title} className="mb-1">
            <Link
                to={href}
                onClick={() => onClick(href)}
                className={clsx(classes.base, isActive ? classes.active : classes.inactive)}>
                <Icon className="h-4 w-4" aria-hidden="true"/>
                {title}
            </Link>
        </div>
    );
}