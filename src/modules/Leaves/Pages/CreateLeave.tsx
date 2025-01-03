import React, {useContext, useEffect, useState} from 'react';
import {useForm, UseFormReturn} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useNavigate} from 'react-router-dom';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {createLeave, getLeavesPolicies, getMyLeaves} from "@/services/leaveService.ts";
import {getErrorMessage} from '~/utils/errorHandler.ts';
import {PageTitle} from '../../../core/components';
import DatePicker from '../Components/DatePicker';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Card} from '@/components/ui/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {toast} from "@/components/ui/use-toast";
import {calculateDuration, calculateWeekends, getNextWorkingDay, isDateInHoliday, isDateInWeekend} from "@/utils/dateUtils";
import {getHolidays} from "@/services/holidayService";
import {HolidayResponse} from "@/constants/types/holidayTypes";
import {UserContext} from "@/contexts/UserContext";
import {Week} from "@/constants/types/enums.ts";
import {capitalizeFirstLetter} from "@/lib/utils.ts";
import {LeaveCreateRequest, LeaveResponse} from "@/constants/types/leaveTypes.ts";

/*
1.Fetch LeavePolicyType name and id from leaves/policies
2.Fetch duration
3.Fetch post method for submit leave request form to /leaves
4.Restrict leave duration to Company Policy by limiting the range to the maximum allowed vacation length

-Calendar:
5.Fetch Holidays from /holidays for disabling in calendar
6.How to handle holidays if year changes
7.Calculate weekends by getting weekDays in organization in UserContext and disable weekends in calendar
8.Disable days before today for start (Start Date Cannot Be After End Date)
9.Disable days before start day for end date (End Date Cannot Be Before Start Date)
10.Start and end date is today date by default. if user changes start date, end date is as the same as start date by default.
 */

dayjs.extend(isBetween);

const FormSchema = z.object({
    leaveCategory: z.string().nonempty("Please select a valid leave type."),
    startDate: z.date(),
    endDate: z.date(),
    reason: z.string().optional(),
});

export default function CreateLeave() {
    const [holidays, setHolidays] = useState<Date[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<{ id: number; name: string }[]>([]);
    const [weekendsDays, setWeekendsDays] = useState<string[]>([]);
    const [userLeaves, setUserLeaves] = useState<LeaveResponse[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {user, organization} = useContext(UserContext);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            leaveCategory: '',
            startDate: new Date(),
            endDate: new Date(),
            reason: '',
        },
    });

    const {handleSubmit, watch, setValue} = form;
    const startDate = watch('startDate');
    const endDate = watch('endDate');

    // Fetch leave policies
    const fetchLeavePolicies = async () => {
        try {
            const policies = await getLeavesPolicies();
            if (!user || !user.leavePolicy?.id) {
                console.log("User or user.leavePolicy.id is not available");
                return
            }

            const userPolicy = policies.find(policy => policy.id === user?.leavePolicy?.id);

            if (userPolicy) {
                const types = userPolicy.activatedTypes.map(activatedType => ({
                    id: activatedType.type.id,
                    name: activatedType.type.name,
                }));
                setLeaveTypes(types);
            } else {
                console.log("No matching policy found for the user.");
            }
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

    // Fetch holidays
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

    // Fetch user's leaves
    const fetchUserLeaves = async () => {
        try {
            const leavesList= await getMyLeaves(1, 1);
            const filteredLeaves = leavesList.contents.filter(
                leave => leave.status === "ACCEPTED" || leave.status === "PENDING"
            );
            setUserLeaves(filteredLeaves);
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error | string);
            setErrorMessage(errorMessage);
            toast({
                title: "Error",
                description: "Failed to fetch user leaves.",
                variant: "destructive",
            });
        }
    };

    //Submit leave request form
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            const selectedType = Number(data.leaveCategory);

            const payload: LeaveCreateRequest = {
                activatedTypeId: selectedType,
                start: dayjs(data.startDate).toISOString(),
                end: dayjs(data.endDate).toISOString(),
                reason: data.reason,
            };

            await createLeave(payload);
            console.log(payload);
            navigate('/leave/pending');
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error | string);
            setErrorMessage(errorMessage);
            toast({title: "Error", description: errorMessage, variant: "destructive"});
        }
    };

    // Fetch leave types, holidays, and user's leaves on mount
    useEffect(() => {
        fetchLeavePolicies();
        fetchHolidays();
        fetchUserLeaves();

        if (organization?.workingDays) {
            const weekends = calculateWeekends(organization.workingDays as Week[]);
            setWeekendsDays(weekends.map(day => capitalizeFirstLetter(day.toLowerCase())));
        }
    }, [organization?.workingDays]);

    // Adjust startDate if it's a weekend or holiday
    useEffect(() => {
        if (isDateInWeekend(startDate, weekendsDays) || isDateInHoliday(startDate, holidays)) {
            setValue("startDate", getNextWorkingDay(startDate, holidays, weekendsDays));
        }
    }, [holidays, startDate, weekendsDays]);

    // Adjust endDate if it’s before startDate
    useEffect(() => {
        if (dayjs(endDate).isBefore(dayjs(startDate))) {
            setValue('endDate', startDate);
        }
    }, [startDate, endDate]);

    const duration = calculateDuration(startDate, endDate)

    return (
        <>
            <PageTitle title="Leave Request"></PageTitle>
            {errorMessage && (
                <Alert className='text-red-500 border-none font-semibold px-4'>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4 gap-4">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <LeaveTypeField form={form} leaveTypes={leaveTypes}/>
                            <section className="grid grid-cols-2 gap-4">
                                <DatePicker
                                    title="Start"
                                    handleDateSelected={(date: Date) => setValue('startDate', date)}
                                    selectedDate={startDate}
                                    daysBefore={new Date()}
                                    holidays={holidays}
                                    weekendsDays={weekendsDays}
                                />
                                <DatePicker
                                    title="End"
                                    handleDateSelected={(date: Date) => setValue('endDate', date)}
                                    selectedDate={endDate}
                                    daysBefore={startDate}
                                    holidays={holidays}
                                    weekendsDays={weekendsDays}
                                />
                            </section>
                            <p className="p-2 text-center text-sm border rounded-md font-semibold">
                                Duration: {duration} {duration === 1 ? 'Day' : 'Days'}
                            </p>
                            <ReasonField form={form}/>
                            <Button type="submit" className="w-fit">Submit</Button>
                        </form>
                    </Form>
                </Card>
            </main>
        </>
    );
}

type FieldProps = {
    form: UseFormReturn;
    leaveTypes?: { id: number; name: string }[];
}

function LeaveTypeField({form, leaveTypes}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="leaveCategory"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a type"/>
                            </SelectTrigger>
                            <SelectContent>
                                {leaveTypes?.map((type) => (
                                    <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    )
}

function ReasonField({form}: FieldProps) {
    return (
        <FormField
            control={form.control}
            name="reason"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                        <Textarea {...field} className="min-h-32"/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    )
}