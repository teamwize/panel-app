import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "react-day-picker/dist/style.css";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {getLeaves} from "@/services/leaveService.ts";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "~/utils/errorHandler.ts";
import "@/index.css";
import {Plus} from "lucide-react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {calculateWeekends} from "@/utils/dateUtils";
import {getHolidays} from "@/services/holidayService";
import {HolidayResponse} from "@/constants/types/holidayTypes";
import {LeaveResponse} from "@/constants/types/leaveTypes.ts";
import {UserContext} from "@/contexts/UserContext";
import {Week} from "@/constants/types/enums.ts";
import {capitalizeFirstLetter} from "@/lib/utils.ts";
import {CustomCalendar} from "@/core/components/calendar/CustomCalendar.tsx";
import {PageHeader} from "@/core/components";
import PageContent from "@/core/components/PageContent.tsx";

// 1.Show holidays on calendar
// 2.Show weekends on calendar
// 3.Show leaves on calendar

dayjs.extend(isBetween);

export default function Home() {
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
            <PageHeader title='Home'>
                <Button className='px-2 h-9' onClick={() => navigate("/leave/create")}>
                    <Plus className="h-4 w-4 mr-1"/>
                    Request Leave
                </Button>
            </PageHeader>
            <PageContent>
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm px-5 w-full"
                      x-chunk="dashboard-02-chunk-1">
                    <CustomCalendar leaves={requestsList} holidays={holidays} weekends={weekendsDays}
                                    onDateSelect={handleDateSelect}/>
                </Card>
            </PageContent>
        </>
    );
}