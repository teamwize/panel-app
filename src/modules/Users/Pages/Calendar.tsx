import React, {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import "react-day-picker/dist/style.css";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {getDaysoff} from "~/services/WorkiveApiClient.ts";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "~/utils/errorHandler.ts";
import {
    DayOffLeaveTypeJson,
    DayOffStatusJson,
    DayOffLeaveTypeColor,
    DayOffStatusColor,
} from "@/constants";
import "../../../constants/style.css";
import {PageTitle, Label, Pagination} from "../../../core/components";
import {DayOffResponse} from "~/constants/types";
import {CircleUser, Plus} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {isDateInWeekend} from "@/utils/dateUtils";
import {getHolidays} from "@/services/WorkiveApiClient";
import {HolidayResponse} from "@/constants/types";
import {UserContext} from "@/contexts/UserContext";

dayjs.extend(isBetween);

export default function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [requestsList, setRequestsList] = useState<DayOffResponse[]>([]);
    const [offDays, setOffDays] = useState<Date[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [calendarCurrentDate, setCalendarCurrentDate] = useState<dayjs.Dayjs>(dayjs(new Date()));
    const [holidays, setHolidays] = useState<HolidayResponse[]>([]);
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    const selectedDateRequests: DayOffResponse[] = requestsList.filter((r) =>
        dayjs(selectedDate).isBetween(dayjs(r.startAt), dayjs(r.endAt), "days", "[]")
    );

    const isWorkingDay: boolean = holidays?.every(
        (holiday: HolidayResponse) => !dayjs(holiday.date).isSame(selectedDate, "day")
    );
    const formattedSelectedDate = dayjs(selectedDate).format("YYYY-MM-DD");
    const formattedHolidaysDate: string = holidays
        ?.map((holiday: HolidayResponse) => dayjs(holiday.date).format("YYYY-MM-DD"))
        .join(", ");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage: number = 5;

    // Get holidays
    useEffect(() => {
        getHolidays(new Date().getFullYear(), user?.countryCode)
            .then((data: HolidayResponse[]) => {
                console.log("Success:", data);
                setHolidays(data);
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

    // Get list of requests
    useEffect(() => {
        getDaysoff()
            .then((data) => {
                console.log("Success:", data.contents);
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

    // Show dayoff lists of working days
    useEffect(() => {
        if (requestsList.length === 0) return;

        const monthDays: number = Number(calendarCurrentDate.endOf("month").format("D"));
        const result: Date[] = [];
        for (let i = 1; i <= monthDays; i++) {
            const currentDate: dayjs.Dayjs = dayjs(calendarCurrentDate).date(i);
            const isHoliday: boolean = holidays.some((holiday: HolidayResponse) =>
                dayjs(holiday.date).isSame(currentDate, "day")
            );
            if (isHoliday) continue;
            const off: DayOffResponse[] = requestsList.filter((r) =>
                currentDate.isBetween(dayjs(r.startAt), dayjs(r.endAt), "days", "[]")
            );
            if (off.length > 0) {
                result.push(currentDate.toDate());
            }
        }
        if (JSON.stringify(result) !== JSON.stringify(offDays)) {
            setOffDays(result);
        }
    }, [requestsList, calendarCurrentDate, holidays]);

    // Reset currentPage when selectedDate changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedDate]);

    const handleMonthChange = (newDate: Date) => {
        setCalendarCurrentDate(dayjs(newDate));
    };

    const showDayOff = (date: Date | undefined) => {
        if (date) setSelectedDate(date);
    };

    const sendRequest = () => {
        navigate("/dayoff/create");
    };

    const calculateDistance = (startAt: string, endAt: string): number => {
        return dayjs(endAt).diff(startAt, "day") + 1;
    };

    const weekendsDays: string[] = ['Saturday', 'Sunday'];

    const isDateDisabled = (date: Date): boolean => {
        if (isDateInWeekend(date, weekendsDays)) {
            return true;
        }
        return holidays.some((holiday) => dayjs(date).isSame(dayjs(holiday.date), 'day'));
    };

    return (
        <>
            <PageTitle title="Calendar">
                <div className="flex justify-center">
                    <Button
                        onClick={sendRequest}
                    >
                        <Plus className="h-5 w-5"/>
                        Request Day Off
                    </Button>
                </div>
            </PageTitle>

            {errorMessage && (
                <Alert>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <main className="flex flex-1 flex-col gap-4 p-4  justify-start justify-items-start">
                <Card
                    className="flex  flex-col rounded-lg border border-dashed shadow-sm justify-start"
                >
                    <div>
                        <Calendar
                            modifiers={{highlighted: offDays, notWorkingDay: isDateDisabled}}
                            modifiersStyles={{
                                highlighted: {fontWeight: 'bold', color: '#1e61a4'},
                                notWorkingDay: {color: "#ef4444"}
                            }}
                            modifiersClassNames={{today: "my-today", selected: "my-selected"}}
                            onMonthChange={handleMonthChange}
                            mode="single"
                            selected={selectedDate}
                            onSelect={showDayOff}
                            initialFocus
                            className='border rounded-lg w-fit p-4 bg-[hsl(var(--muted)/0.4)]'
                        />
                    </div>

                    <div>
                        <Card x-chunk="dashboard-05-chunk-3" className="border-0 shadow-amber-50">
                            <CardHeader className="px-6 py-4">
                                <CardTitle className="text-xl">
                                    Requests
                                    ({formattedHolidaysDate.includes(formattedSelectedDate) ? 0 : selectedDateRequests.length})
                                </CardTitle>
                            </CardHeader>

                            {isWorkingDay && selectedDateRequests.length > 0 && (
                                <div>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Employee</TableHead>
                                                    <TableHead>Team</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Date</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            {selectedDateRequests
                                                .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
                                                .map((request) => (
                                                    <RequestItem
                                                        calculateDistance={calculateDistance}
                                                        request={request}
                                                        key={request.id}
                                                    />
                                                ))}
                                        </Table>
                                    </CardContent>

                                    {selectedDateRequests.length > recordsPerPage && (
                                        <Pagination
                                            pageSize={recordsPerPage}
                                            pageNumber={currentPage}
                                            setPageNumber={setCurrentPage}
                                            totalContents={selectedDateRequests.length}
                                        />
                                    )}
                                </div>
                            )}
                        </Card>
                    </div>
                </Card>
            </main>
        </>
    );
}

type RequestItemProps = {
    request: DayOffResponse;
    calculateDistance: (startAt: string, endAt: string) => number;
};

function RequestItem({request, calculateDistance}: RequestItemProps) {
    const distance: number = calculateDistance(request.startAt, request.endAt);

    return (
        <TableBody className="border-b">
            <TableRow>
                <TableCell className="flex flex-wrap flex-row gap-2 font-medium">
                    <CircleUser className="h-6 w-6"/>
                    {request.user.firstName} {request.user.lastName}
                </TableCell>
                <TableCell>{request.user.team.name}</TableCell>
                <TableCell>
                    <Label type={DayOffStatusColor[request.status]} text={DayOffStatusJson[request.status]}/>
                </TableCell>
                <TableCell>
                    <Label type={DayOffLeaveTypeColor[request.type]} text={DayOffLeaveTypeJson[request.type]}/>
                </TableCell>
                <TableCell>
                    {distance === 1
                        ? dayjs(request.startAt).format("D MMM")
                        : `${dayjs(request.startAt).format("D MMM")} - ${dayjs(request.endAt).format("D MMM")}`}
                    {' '} ({distance} {distance === 1 ? "Day" : "Days"})
                </TableCell>
            </TableRow>
        </TableBody>
    );
}