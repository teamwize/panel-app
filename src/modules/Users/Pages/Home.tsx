import React, {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import "react-day-picker/dist/style.css";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {getLeaves} from "@/services/leaveService.ts";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "~/utils/errorHandler.ts";
import "@/index.css";
import {PageTitle} from "../../../core/components";
import {Plus} from "lucide-react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert"
import {calculateWeekends} from "@/utils/dateUtils";
import {getHolidays} from "@/services/holidayService";
import {HolidayResponse} from "@/constants/types/holidayTypes";
import {LeaveResponse} from "@/constants/types/leaveTypes.ts";
import {UserContext} from "@/contexts/UserContext";
import {Week} from "@/constants/types/enums.ts";
import {capitalizeFirstLetter} from "@/lib/utils.ts";
import {CustomCalendar} from "@/core/components/calendar/CustomCalendar.tsx";

// 1.Show holidays on calendar
// 2.Show weekends on calendar
// 3.Show leaves on calendar

dayjs.extend(isBetween);

export default function Home() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [requestsList, setRequestsList] = useState<LeaveResponse[]>([]);
    const [holidays, setHolidays] = useState<Date[]>([]);
    const [weekendsDays, setWeekendsDays] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
            setErrorMessage(errorMessage);
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
                console.log("Leaves List:", data.contents);
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

    const sendRequest = () => {
        navigate("/leave/create");
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    }

    return (
        <>
            <PageTitle title="Home">
                <div className="flex justify-center">
                    <Button onClick={sendRequest}>
                        <Plus className="h-5 w-5"/>
                        Request Leave
                    </Button>
                </div>
            </PageTitle>

            {errorMessage && (
                <Alert className='text-red-500 border-none font-semibold px-4'>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm px-5 w-full" x-chunk="dashboard-02-chunk-1">
                    <CustomCalendar vacations={requestsList} holidays={holidays} weekends={weekendsDays} onDateSelect={handleDateSelect}/>
                </Card>
            </main>
        </>
    );
}