import React, { useContext, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Logo } from '.';
import {House, ChartPie, Settings, Building, Menu, Bell, User, Users, Clock, TreePalm} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserContext } from "@/contexts/UserContext";
import { Badge } from "@/components/ui/badge"

export default function Sidebar() {
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    // Main Navigation items
    const navigation = [
        { name: 'Home', href: '/', icon: House },
        { name: 'Balance', href: '/balance', icon: ChartPie },
        { name: 'Settings', href: '/settings', icon: Settings },
        ...(user?.role === 'ORGANIZATION_ADMIN'
                ? [{
                    name: 'Management',
                    href: '/organization',
                    icon: Building,
                    subItems: [
                        { name: 'Requests', href: '/requests', icon: Clock, length: 3 },
                        { name: 'Organization', href: '/organization', icon: Building },
                        { name: 'Policy', href: '/policy', icon: TreePalm },
                        { name: 'Employees', href: '/employees', icon: User },
                        { name: 'Teams', href: '/teams', icon: Users },
                    ],
                }]
                : []
        ),
    ];

    const handleNavigation = (path: string) => {
        setSelectedOption(path);
        setSheetOpen(false);
        navigate(path);
    };

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            {/* Sidebar */}
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-4">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link to="/" className="flex items-center gap-2 font-semibold">
                            <Logo className="h-6 w-6" />
                            <span>Teamwize</span>
                        </Link>
                        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                    </div>

                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            {/* Main Navigation */}
                            {navigation.slice(0, 3).map((item) => (
                                <div key={item.name} className="mb-1">
                                    <Link
                                        to={item.href}
                                        onClick={() => handleNavigation(item.href)}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                                            location.pathname === item.href || selectedOption === item.href
                                                ? 'bg-indigo-100 dark:bg-indigo-800 bg-opacity-75'
                                                : 'text-muted-foreground hover:text-primary'
                                        }`}
                                    >
                                        <item.icon className="h-4 w-4" aria-hidden="true" />
                                        {item.name}
                                    </Link>
                                </div>
                            ))}

                            {user?.role === 'ORGANIZATION_ADMIN' && (
                                <>
                                    <div className="px-3 text-[10px] text-muted-foreground uppercase tracking-wide mt-4 mb-2">
                                        Management
                                    </div>

                                    {/* Sub-navigation for Organization */}
                                    {navigation[3]?.subItems?.map((subItem) => (
                                        <div key={subItem.name} className="mb-1">
                                            <Link
                                                to={subItem.href}
                                                onClick={() => handleNavigation(subItem.href)}
                                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                                                    location.pathname === subItem.href
                                                        ? 'bg-indigo-100 dark:bg-indigo-800 bg-opacity-75'
                                                        : 'text-muted-foreground hover:text-primary'
                                                }`}
                                            >
                                                <subItem.icon className="h-4 w-4" aria-hidden="true" />
                                                {subItem.name}
                                                {subItem?.length && (
                                                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                                        {subItem?.length}
                                                    </Badge>
                                                    )
                                                }
                                            </Link>
                                        </div>
                                    ))}
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar (Sheet) */}
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                                onClick={() => setSheetOpen(true)}
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <Logo className="h-6 w-6" />
                            <nav className="grid gap-2 text-lg font-medium">
                                {navigation.map((item) => (
                                    <div key={item.name} className="mb-2">
                                        <Link
                                            to={item.href}
                                            className={`flex items-center gap-4 rounded-xl px-3 py-2 transition-all ${
                                                selectedOption === item.href
                                                    ? 'bg-muted text-foreground'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                            onClick={() => handleNavigation(item.href)}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {item.name}
                                        </Link>

                                        {/* Sub-navigation for Mobile */}
                                        {item.subItems && (
                                            <div className="ml-6 mt-2">
                                                {item.subItems?.map((subItem) => (
                                                    <Link
                                                        key={subItem.name}
                                                        to={subItem.href}
                                                        className={`block py-1 text-xs ${
                                                            location.pathname === subItem.href
                                                                ? 'text-primary'
                                                                : 'text-muted-foreground hover:text-primary'
                                                        }`}
                                                        onClick={() => handleNavigation(subItem.href)}
                                                    >
                                                        <subItem.icon className="inline-block h-4 w-4 mr-2" />
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </header>
            </div>
        </div>
    );
}