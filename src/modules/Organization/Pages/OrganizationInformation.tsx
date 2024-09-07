import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {getOrganization, updateOrganization} from '~/services/WorkiveApiClient.ts';
import {getErrorMessage} from '~/utils/errorHandler.ts';
import {countries} from '~/constants/index.ts';
import {OrganizationResponse, Week, OrganizationUpdateRequest} from '~/constants/types';
import {toast} from "@/components/ui/use-toast";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {z} from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ChevronLeft} from "lucide-react";

const FormSchema = z.object({
    name: z.string().min(2, {message: "Organization name must be over 2 characters"}).max(20, {message: "Organization name must be under 20 characters"}),
    country: z.string().min(1, {message: "Country is required"}),
    timezone: z.string().min(1, {message: "Timezone is required"}),
    weekFirstDay: z.nativeEnum(Week, {errorMap: () => ({message: "Week starting day is required"})}),
    workingDays: z.array(z.nativeEnum(Week)).min(1, {message: "At least one working day is required"}),
});

function getWeekDayName(day: Week): string {
    return day.charAt(0) + day.slice(1).toLowerCase();
}

export default function OrganizationSettings() {
    const navigate = useNavigate();
    const [organizationInfo, setOrganizationInfo] = useState<OrganizationResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            country: '',
            timezone: '',
            weekFirstDay: Week.MONDAY,
            workingDays: []
        },
    });

    const goBack = () => navigate('/organization');

    useEffect(() => {
        getOrganization()
            .then((response: OrganizationResponse) => {
                setOrganizationInfo(response);
                console.log(response);
                form.reset({
                    name: response.name,
                    country: response.country,
                    timezone: response.timezone,
                    weekFirstDay: response.weekFirstDay,
                    workingDays: response.workingDays,
                });
            })
            .catch((error) => {
                const errorMessage = getErrorMessage(error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            });
    }, []);

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const payload: OrganizationUpdateRequest = {
            name: data.name,
            timezone: data.timezone,
            country: data.country,
            metadata: {},
            workingDays: data.workingDays,
            weekFirstDay: data.weekFirstDay
        };

        setIsProcessing(true);

        updateOrganization(payload)
            .then((response: OrganizationResponse) => {
                setIsProcessing(false);
                setOrganizationInfo(response);
                toast({
                    title: "Success",
                    description: "Organization updated successfully!",
                    variant: "default",
                });
            })
            .catch((error) => {
                setIsProcessing(false);
                const errorMessage = getErrorMessage(error);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            });
    };

    return (
        <>
            <div className="flex flex-wrap text-lg font-medium px-4 pt-4 gap-2">
                <button onClick={goBack}>
                    <ChevronLeft className="h-6 w-6"/>
                </button>
                <h1 className="text-lg font-semibold md:text-2xl">Organization Setting</h1>
            </div>

            {errorMessage && (
                <Alert>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <main className="flex flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col rounded-lg border border-dashed shadow-sm p-4 gap-4"
                      x-chunk="dashboard-02-chunk-1">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Organization Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Organization Name" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="country"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a country"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {countries.map(country => (
                                                        <SelectItem key={country.code} value={country.code}>
                                                            {country.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="timezone"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Timezone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Timezone" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="weekFirstDay"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Week Starting Day</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select starting day"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.values(Week).map(day => (
                                                        <SelectItem key={day} value={day}>
                                                            {getWeekDayName(day)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="workingDays"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Working Days</FormLabel>
                                        <div className="grid grid-cols-2 gap-2">
                                            {Object.values(Week).map(day => (
                                                <div key={day} className="flex items-center">
                                                    <Checkbox
                                                        value={day}
                                                        checked={field.value.includes(day)}
                                                        onCheckedChange={isChecked => {
                                                            if (isChecked) {
                                                                field.onChange([...field.value, day]);
                                                            } else {
                                                                field.onChange(field.value.filter(d => d !== day));
                                                            }
                                                        }}
                                                    />
                                                    <label htmlFor={day} className="ml-2">{getWeekDayName(day)}</label>
                                                </div>
                                            ))}
                                        </div>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-fit" disabled={isProcessing}>
                                {isProcessing ? 'Processing...' : 'Save'}
                            </Button>
                        </form>
                    </Form>
                </Card>
            </main>
        </>
    );
}