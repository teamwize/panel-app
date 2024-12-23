import {useState} from 'react';
import {Card} from '@/components/ui/card';
import {CalendarHeader} from "@/core/components/calendar/CalendarHeader.tsx";
import {CalendarGrid} from "@/core/components/calendar/CalendarGrid.tsx";
import {LeaveResponse} from "@/constants/types/leaveTypes.ts";

interface CalendarProps {
    vacations: LeaveResponse[];
    holidays?: Date[];
    weekends?: string[];
    onDateSelect?: (date: Date) => void;
}

export function CustomCalendar({vacations, holidays, weekends, onDateSelect}: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>();

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        onDateSelect?.(date);
    };

    return (
        <Card className="w-full my-4 flex flex-col overflow-hidden h-fit">
            <CalendarHeader
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
            />
            <CalendarGrid
                currentMonth={currentMonth}
                vacations={vacations}
                holidays={holidays}
                weekends={weekends}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
            />
        </Card>
    );
}