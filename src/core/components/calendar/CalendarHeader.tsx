import {ChevronLeft, ChevronRight, CalendarDays} from 'lucide-react';
import dayjs from 'dayjs';
import {Button} from '@/components/ui/button';

interface CalendarHeaderProps {
    currentMonth: Date;
    onMonthChange: (date: Date) => void;
}

export function CalendarHeader({currentMonth, onMonthChange}: CalendarHeaderProps) {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
            <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary"/>
                <h2 className="text-xl font-semibold tracking-tight">{dayjs(currentMonth).format('MMMM YYYY')}</h2>
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onMonthChange(dayjs(currentMonth).subtract(1, 'month').toDate())}
                    className="rounded-full hover:bg-primary hover:text-primary-foreground"
                >
                    <ChevronLeft className="h-4 w-4"/>
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onMonthChange(dayjs(currentMonth).add(1, 'month').toDate())}
                    className="rounded-full hover:bg-primary hover:text-primary-foreground"
                >
                    <ChevronRight className="h-4 w-4"/>
                </Button>
            </div>
        </div>
    );
}