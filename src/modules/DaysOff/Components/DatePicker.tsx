import dayjs from 'dayjs';
import {useState, useCallback} from 'react';
import 'react-day-picker/dist/style.css';
import "@/index.css";
import {CalendarDays} from 'lucide-react';
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {Label} from "@/components/ui/label";
import {isDateInWeekend} from "@/utils/dateUtils";

type DatePickerProps = {
    title: string;
    handleDateSelected: (date: Date) => void;
    selectedDate: Date;
    daysBefore: Date;
    holidays: Date[];
    weekendsDays : string[]
};

export default function DatePicker({title, handleDateSelected, selectedDate, daysBefore, holidays, weekendsDays}: DatePickerProps) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const handleDaySelected = useCallback((date: Date) => {
        handleDateSelected(date);
        setIsPopoverOpen(false);
    }, [handleDateSelected]);

    const isDateDisabled = useCallback((date: Date): boolean => {
        if (!isDateInWeekend(date, weekendsDays)) {
            return dayjs(date).isBefore(dayjs(daysBefore), 'day') || holidays.some(holiday => dayjs(date).isSame(dayjs(holiday), 'day'));
        }
        return true;
    }, [holidays, weekendsDays, daysBefore]);

    return (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
                <div className="flex flex-col gap-2">
                    <Label htmlFor={title}>{title}</Label>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                    >
                        <CalendarDays className="mr-2 h-4 w-4"/>
                        <span>{dayjs(selectedDate).format('D MMM')}</span>
                    </Button>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    modifiers={{notWorkingDay: isDateDisabled}}
                    modifiersStyles={{notWorkingDay: {color: '#ef4444'}}}
                    modifiersClassNames={{today: 'my-today', selected: 'my-selected'}}
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDaySelected}
                    disabled={isDateDisabled}
                />
            </PopoverContent>
        </Popover>
    );
}