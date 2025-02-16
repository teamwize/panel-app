import {useState} from 'react';
import {Card} from '@/components/ui/card.tsx';
import {CalendarHeader} from "@/modules/calendar/components/CalendarHeader.tsx";
import {CalendarGrid} from "@/modules/calendar/components/CalendarGrid.tsx";
import {LeaveResponse} from "@/core/types/leave.ts";

interface CalendarProps {
    leaves: LeaveResponse[];
    holidays?: Date[];
    weekends?: string[];
    onDateSelect?: (date: Date) => void;
}

export function CustomCalendar({leaves, holidays, weekends, onDateSelect}: CalendarProps) {
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
                leaves={leaves}
                holidays={holidays}
                weekends={weekends}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
            />
        </Card>
    );
}