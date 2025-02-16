import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "react-day-picker/dist/style.css";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {getLeaves} from "@/core/services/leaveService.ts";
import {toast} from "@/components/ui/use-toast.ts";
import {getErrorMessage} from "@/core/utils/errorHandler.ts";
import "@/index.css";
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {calculateWeekends} from "@/core/utils/date.ts";
import {getHolidays} from "@/core/services/holidayService.ts";
import {HolidayResponse} from "@/core/types/holiday.ts";
import {LeaveResponse} from "@/core/types/leave.ts";
import {UserContext} from "@/contexts/UserContext.tsx";
import {Week} from "@/core/types/enum.ts";
import {CustomCalendar} from "@/modules/calendar/components/CustomCalendar.tsx";
import PageContent from "@/components/layout/PageContent.tsx";
import {capitalizeFirstLetter} from "@/core/utils/string.ts";
import PageHeader from "@/components/layout/PageHeader.tsx";

// 1.Show holidays on calendar
// 2.Show weekends on calendar
// 3.Show leaves on calendar

dayjs.extend(isBetween);

export default function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [requestsList, setRequestsList] = useState<LeaveResponse[]>([]);
    const [holidays, setHolidays] = useState<Date[]>([]);
    const [weekendsDays, setWeekendsDays] = useState<string[]>([]);
    const navigate = useNavigate();
    const {user, organization} = useContext(UserContext);

    // Fetch holidays for the current and next year.
    const fetchHolidays = async () => {
        try {
            const currentYear = new Date().getFullYear();
            const nextYear = currentYear + 1;
            const currentYearHolidays: HolidayResponse[] = await getHolidays(currentYear, user?.country);
            const nextYearHolidays: HolidayResponse[] = await getHolidays(nextYear, user?.country);
            const holidaysDates = [
                ...currentYearHolidays.map((holiday) => new Date(holiday.date)),
                ...nextYearHolidays.map((holiday) => new Date(holiday.date)),
            ];
            setHolidays(holidaysDates);
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error | string);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        }
    };

    // Fetch leave requests
    useEffect(() => {
        getLeaves()
            .then((data) => {
                setRequestsList(data.contents);
            })
            .catch((error) => {
                console.error("Error:", error);
                const errorMessage = getErrorMessage(error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive"
                });
            });
    }, []);

    // Fetch holidays and weekends
    useEffect(() => {
        fetchHolidays();

        if (organization?.workingDays) {
            const weekends = calculateWeekends(organization.workingDays as Week[]);
            setWeekendsDays(weekends.map(day => capitalizeFirstLetter(day.toLowerCase())));
        }
    }, [organization?.workingDays]);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    }

    return (
        <>
            <PageHeader title='Calendar'>
                <Button className='px-2 h-9' onClick={() => navigate("/leaves/create")}>
                    <Plus className="h-4 w-4 mr-1"/>
                    Request Leave
                </Button>
            </PageHeader>
            <PageContent>
                <CustomCalendar
                    leaves={requestsList}
                    holidays={holidays}
                    weekends={weekendsDays}
                    onDateSelect={handleDateSelect}
                />
            </PageContent>
        </>
    );
}