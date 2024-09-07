import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Logo } from '.'
import { Calendar, ChartPie, Settings, Building, Menu, Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navigation = [
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Balance', href: '/balance', icon: ChartPie },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Organization', href: '/organization', icon: Building },
];

export default function Sidebar() {
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const location = useLocation();
    const navigate = useNavigate();

    // Function to close the Sheet and navigate
    const handleNavigation = (path: string) => {
        setSelectedOption(path);
        setSheetOpen(false);
        navigate(path);
    }

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            {/* Sidebar */}
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link to="/calendar" className="flex items-center gap-2 font-semibold">
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
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
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
                            ))}
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
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`flex items-center gap-4 rounded-xl px-3 py-2 transition-all ${
                                            selectedOption === item.href ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                        onClick={() => handleNavigation(item.href)}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </header>
            </div>
        </div>
    )
}