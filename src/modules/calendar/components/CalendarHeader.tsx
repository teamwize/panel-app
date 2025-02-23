import {CalendarDays, ChevronLeft, ChevronRight} from 'lucide-react';
import dayjs from 'dayjs';
import {Button} from '@/components/ui/button.tsx';

interface CalendarHeaderProps {
    currentMonth: Date;
    onMonthChange: (date: Date) => void;
}

export function CalendarHeader({currentMonth, onMonthChange}: CalendarHeaderProps) {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
            <div className="flex items-center gap-3 group">
                <CalendarDays className="h-5 w-5 text-primary group-hover:scale-110 transition-transform"/>
                <h2 className="text-xl font-semibold tracking-tight">
                    <span className="text-primary">{dayjs(currentMonth).format('MMMM')}</span>
                    <span className="ml-1.5 text-muted-foreground">{dayjs(currentMonth).format('YYYY')}</span>
                </h2>
            </div>
            <div className="flex gap-1.5">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onMonthChange(dayjs(currentMonth).subtract(1, 'month').toDate())}
                    className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                >
                    <ChevronLeft className="h-5 w-5"/>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onMonthChange(dayjs(currentMonth).add(1, 'month').toDate())}
                    className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                >
                    <ChevronRight className="h-5 w-5"/>
                </Button>
            </div>
        </div>
    );
}