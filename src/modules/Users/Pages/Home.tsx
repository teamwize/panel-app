import React, {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import "react-day-picker/dist/style.css";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {getLeaves} from "@/services/leaveService.ts";
import {toast} from "@/components/ui/use-toast";
import {getErrorMessage} from "~/utils/errorHandler.ts";
import "@/index.css";
import {PageTitle, Pagination} from "../../../core/components";
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
import {getHolidays} from "@/services/holidayService";
import {HolidayResponse} from "@/constants/types/holidayTypes";
import {LeaveResponse} from "@/constants/types/leaveTypes.ts";
import {UserResponse} from "@/constants/types/userTypes";
import {UserContext} from "@/contexts/UserContext";
import {LeaveDuration} from "@/core/components";
import LeaveStatusBadge from "@/core/components/LeaveStatusBadge.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {LEAVE_TYPE} from "@/constants/types/enums.ts";

dayjs.extend(isBetween);

export default function Home() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [requestsList, setRequestsList] = useState<LeaveResponse[]>([]);
    const [leaveDays, setLeaveDays] = useState<Date[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [calendarCurrentDate, setCalendarCurrentDate] = useState<dayjs.Dayjs>(dayjs(new Date()));
    const [holidays, setHolidays] = useState<HolidayResponse[]>([]);
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    const selectedDateRequests: LeaveResponse[] = requestsList.filter((r) =>
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
        getHolidays(new Date().getFullYear(), user?.country)
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
        getLeaves()
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

    // Show leave lists of working days
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
            const off: LeaveResponse[] = requestsList.filter((r) =>
                currentDate.isBetween(dayjs(r.startAt), dayjs(r.endAt), "days", "[]")
            );
            if (off.length > 0) {
                result.push(currentDate.toDate());
            }
        }
        if (JSON.stringify(result) !== JSON.stringify(leaveDays)) {
            setLeaveDays(result);
        }
    }, [requestsList, calendarCurrentDate, holidays]);

    // Reset currentPage when selectedDate changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedDate]);

    const handleMonthChange = (newDate: Date) => {
        setCalendarCurrentDate(dayjs(newDate));
    };

    const showLeave = (date: Date | undefined) => {
        if (date) setSelectedDate(date);
    };

    const sendRequest = () => {
        navigate("/leave/create");
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
            <PageTitle title="Home">
                <div className="flex justify-center">
                    <Button
                        onClick={sendRequest}
                    >
                        <Plus className="h-5 w-5"/>
                        Request Leave
                    </Button>
                </div>
            </PageTitle>

            {errorMessage && (
                <Alert>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card
                    className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm"
                    x-chunk="dashboard-02-chunk-1"
                >
                    <Calendar
                        modifiers={{highlighted: leaveDays, notWorkingDay: isDateDisabled}}
                        modifiersStyles={{
                            highlighted: {color: "#6366f1", fontWeight: "bolder"},
                            notWorkingDay: {color: "#ef4444"}
                        }}
                        modifiersClassNames={{today: "my-today", selected: "my-selected"}}
                        onMonthChange={handleMonthChange}
                        mode="single"
                        selected={selectedDate}
                        onSelect={showLeave}
                        initialFocus
                        className='border rounded-lg w-fit p-4 bg-[hsl(var(--muted)/0.4)] mx-auto'
                    />

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
                                                    <TableHead>Duration</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            {selectedDateRequests
                                                .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
                                                .map((request) => (
                                                    <RequestItem
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
    request: LeaveResponse;
};

function RequestItem({request}: RequestItemProps) {
    const {accessToken} = useContext(UserContext);
    return (
        <TableBody className="border-b">
            <TableRow>
                <TableCell className="flex flex-wrap flex-row gap-2 font-medium">
                    <img
                        src={getUserAvatarURL(request.user, accessToken)}
                        alt="Profile Image"
                        className="h-8 rounded-full"
                    />
                    {request.user.firstName} {request.user.lastName}
                </TableCell>
                <TableCell>{request.user.team?.name}</TableCell>
                <TableCell>
                    <LeaveStatusBadge status={request.status} />
                </TableCell>
                <TableCell>
                    <Badge variant={"outline"}>{LEAVE_TYPE[request.type]}</Badge>
                </TableCell>
                <LeaveDuration request={request}/>
            </TableRow>
        </TableBody>
    );
}

function getUserAvatarURL(user: UserResponse, accessToken: string): string {
    if (!user.avatar) {
        return "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png";
    }
    return `${user.avatar.url}?token=${accessToken}`;
}