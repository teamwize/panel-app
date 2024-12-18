import React, {useContext, useEffect, useState} from 'react';
import {useForm, UseFormReturn} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useNavigate} from 'react-router-dom';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {createLeaves, getLeavesPolicies} from "@/services/leaveService.ts";
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
import {LeaveCreateRequest, LeaveTypeResponse} from "@/constants/types/leaveTypes.ts";
import {Week} from "@/constants/types/enums.ts";
import {capitalizeFirstLetter} from "@/lib/utils.ts";

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
            const types = policies.flatMap((policy) => policy.types);
            setLeaveTypes(types);
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
            const holidaysResponse: HolidayResponse[] = await getHolidays(new Date().getFullYear(), user?.country);
            const holidaysDates = holidaysResponse.map((holiday) => new Date(holiday.date));
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

    // Calculate leave duration
    const calculateDistance = (): number => {
        const duration = calculateDuration(startDate, endDate);
        const filteredHolidays = holidays.filter((h) =>
            dayjs(h).isBetween(dayjs(startDate), dayjs(endDate), 'days', '[]')
        );
        return duration - filteredHolidays.length;
    };

    //Submit leave request form
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            const selectedType = leaveTypes.find((type) => type.name === data.leaveCategory);

            const payload: LeaveCreateRequest = {
                typeId: selectedType.id,
                start: dayjs(data.startDate).toISOString(),
                end: dayjs(data.endDate).toISOString(),
                reason: data.reason,
            };

            await createLeaves(payload);
            navigate('/leave/pending');
        } catch (error) {
            const errorMessage = getErrorMessage(error as Error | string);
            setErrorMessage(errorMessage);
            toast({title: "Error", description: errorMessage, variant: "destructive"});
        }
    };

    // Fetch leave types and holidays on mount
    useEffect(() => {
        fetchLeavePolicies();
        fetchHolidays();

        if (organization?.workingDays) {
            const weekends = calculateWeekends(organization.workingDays as Week[]);
            setWeekendsDays(weekends.map(day => capitalizeFirstLetter(day.toLowerCase())));
        }
    }, [organization]);

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

    const duration = calculateDistance();

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
                                    <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
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